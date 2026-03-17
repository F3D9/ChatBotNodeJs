import "dotenv/config";
import { Pool } from "pg";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { StringValue } from "ms";
import "./config/index.js";

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

async function userAlreadyCreated(user:string,email:string){
    const resultUserName = await dbUsuarios.query(
        'SELECT username FROM users WHERE username = $1 or email = $2',
        [user,email]
    );

    if(resultUserName.rows.length > 0)
        return true;

    return false;
}   

async function createUserDataBase(user:string,email:string,password:string){
    await dbUsuarios.query(
        'INSERT INTO users(username,email,password) VALUES ($1,$2,$3)',
        [user,email,password]  
    );
}

async function emailAlreadyRegisted(email:string){
    const resultEmail = await dbUsuarios.query(
        'SELECT username,password FROM users WHERE email = $1',
        [email]
    );

    return resultEmail;
}

async function deleteUserQuery(email:string){
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
    
    const userPassword:any = await emailAlreadyRegisted(email);
    if(userPassword.rows[0].username.length == 0)
        return res.status(400).send({status:"Error",message:"Los campos estan mal"});

    const loginCorrecto = await bcryptjs.compare(password,userPassword.rows[0].password);

    if(!loginCorrecto)
        return res.status(400).send({status:"Error",message:"Los campos estan mal"});

    const token = jsonwebtoken.sign(
        {user:userPassword.rows[0].username},
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRATION as StringValue}
    );

    const cookieOption= {
        expires: new Date(Date.now() + Number(process.env.JWT_COOKIE_EXPIRES) * 24 * 60 * 60 * 1000),
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

export const authentication = {
    register,
    login,
    deleteAcount
}



   