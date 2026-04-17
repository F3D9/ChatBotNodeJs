import "dotenv/config";
import { Pool, Result } from "pg";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { StringValue } from "ms";
import { Request, Response } from "express";
import "./config/index.js";
import { debug } from "util";

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

async function login(req:Request,res:Response){
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
        sameSite:'strict' as const
    }

    res.cookie("jwt",token,cookieOption);
    return res.json({ 
        status: "ok", 
        message: "Usuario loggeado", 
        redirect: "/",
        username: userPassword.rows[0].username, 
        email: email 
    })

}

async function register(req:Request,res:Response){
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

async function deleteAcount(req:Request,res:Response){
    const email = req.body.email;

    const user = await emailAlreadyRegisted(email);
    
    if(user.rows.length == 0)
        return res.status(400).send({status:"Error",message:"No existe ese usuario"});

    const userDeleted = await deleteUserQuery(email);

    if(!userDeleted)
        return res.status(400).send({status:"Error",message:"Fallo al borrar cuenta"});
    
    return res.status(201).send({status:"ok",message:"Cuenta Borrada con exito"});

}   

async function createConversation(user: number, title:string){
    const result = await dbUsuarios.query(
        'INSERT INTO conversations(id_user, title) VALUES ($1,$2) RETURNING id_conversations',
        [user,title]  
    );
    return result.rows[0].id_conversations;
}

async function createMessage(id_conversations:number,content:string,writer:string){
    await dbUsuarios.query(
        'INSERT INTO messages(id_conversations,content,writer) VALUES ($1,$2,$3)',
        [id_conversations,content,writer]  
    );
}

async function getMessages(id_conversations:number) {
    const res = await dbUsuarios.query(
        'SELECT * FROM messages WHERE id_conversations = $1',
        [id_conversations]  
    );
    return res;
}

async function getConversations(id_user){
    const result = await dbUsuarios.query(
        'SELECT * FROM conversations WHERE id_user = $1',
        [id_user]  
    );
    
    return result;
}

async function getOneConversation(id_user,title){
    const result = await dbUsuarios.query(
        'SELECT id_conversations FROM conversations WHERE id_user = $1 and title = $2 limit 1',
        [id_user,title]  
    );
    return result.rows[0].id_conversations;
}

async function saveConversationMessages(id_conversations:number,message:string, id_user:number){
    if(id_conversations == null){
        id_conversations = await createConversation(id_user,message);
    }
    createMessage(id_conversations,message,"user")

    return id_conversations;
}

async function getUserId(user:string,email:string){
    const result = await dbUsuarios.query(
        'SELECT id FROM users WHERE username = $1 and email = $2 limit 1',
        [user,email]  
    );
    return result.rows[0].id;
}

async function saveBotMessages(id_conversations:number,message:string,){
    createMessage(id_conversations,message,"bot");
}

export const authentication = {
    register,
    login,
    deleteAcount,
    saveConversationMessages,
    saveBotMessages,
    getUserId,
    getConversations,
    getMessages,

}



   