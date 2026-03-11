const { Pool } = require('pg');
const bcryptjs = require('bcryptjs');
const { redirect, status } = require('express/lib/response');
const jsonwebtoken = require('jsonwebtoken');
const dotenv = require('dotenv');
const { connectionString, ssl } = require('pg/lib/defaults');

dotenv.config();

const dbUsuarios = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:{
        rejectUnauthorized:false
    }
});

// const dbUsuarios = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT
// });

async function userAlreadyCreated(user,email){
    const resultUserName = await dbUsuarios.query(
        'SELECT username FROM users WHERE username like $1',
        [user]
    );

    const resultEmail = await dbUsuarios.query(
        'SELECT email FROM users WHERE email like $1',
        [email]
    );

    if(resultUserName.rows.length > 0 || resultEmail.rows.length > 0)
        return true;

    return false;
}   

async function createUserDataBase(user,email,password){
    const result = await dbUsuarios.query(
        'INSERT INTO users(username,email,password) VALUES ($1,$2,$3)',
        [user,email,password]  
    );
}

async function emailAlreadyRegisted(email){
    const resultEmail = await dbUsuarios.query(
        'SELECT username,password FROM users WHERE email = $1',
        [email]
    );

    return resultEmail;
}

async function deleteUserQuery(email){
    const resultEmail = await dbUsuarios.query(
        'DELETE FROM users WHERE email = $1',
        [email]
    )

    return resultEmail;
}


async function login(req,res){
    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password){
        return res.status(400).send({status:"Error",message:"Los campos estan incompletos"});
    }
    
    const userPassword = await emailAlreadyRegisted(email);
    if(userPassword.length == 0)
        return res.status(400).send({status:"Error",message:"Los campos estan mal"});

    const loginCorrecto = await bcryptjs.compare(password,userPassword.rows[0].password);

    if(!loginCorrecto)
        return res.status(400).send({status:"Error",message:"Los campos estan mal"});

    const token = jsonwebtoken.sign(
        {user:userPassword.rows[0].username},
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRATION}
    );

    const cookieOption= {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        path:"/",
        httpOnly:true,
        secure:true,
        sameSite:'strict'
    }

    res.cookie("jwt",token,cookieOption);
    res.send({status:"ok",message:"Usuario loggeado",redirect:"/"})

}

async function register(req,res){
    const user = req.body.user;
    const email = req.body.email;
    const password = req.body.password;

    
    if(!user || !email || !password){
        return res.status(400).send({status:"Error",message:"Los campos estan incompletos"});
    }
    
    if(await userAlreadyCreated(user,email))
        return res.status(400).send({status:"Error",message:"Ese usuario ya existe"});


    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password,salt);

    createUserDataBase(user,email,hashPassword);

    return res.status(201).send({status:"ok",message:"Usuario Logueado",redirect:"/login"});

}

async function deleteAcount(req,res){
    const email = req.body.email;

    const user = await emailAlreadyRegisted(email);
    
    if(user.rows.length == 0)
        return res.status(400).send({status:"Error",message:"No existe ese usuario"});

    const userDeleted = await deleteUserQuery(email);

    if(!userDeleted)
        return res.status(400).send({status:"Error",message:"Fallo al borrar cuenta"});
    
    return res.status(201).send({status:"ok",message:"Cuenta Borrada con exito"});


}   

module.exports = {
    methods:{
        register,
        login,
        deleteAcount
    }
};
   