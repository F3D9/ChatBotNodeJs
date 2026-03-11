require("dotenv").config();

const express = require("express");
const path = require('path');

const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

const { methods: authentication } = require("./authentication");

app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname,'.././public')));

if(!process.env.GEMINI_API_KEY){
    console.error("Error: env file is missing the API Key");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateContent() {
    const inputClient = document.getElementById("input").value;

    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        systemInstruction: "Sos el asistente de mi aplicación web.Reglas obligatorias:1_ Máximo 3 frases por respuesta.2- Nunca más de 80 palabras.3- Nunca hagas guías largas.4- Nunca uses títulos o secciones.5- Responde claro y corto. "
     });

    const prompt = inputClient;

    //const result = await model.generateContent(prompt);
    const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
        maxOutputTokens: 150
    }});

    let response = result.response.text();

    const words = response.split(" ");
    if (words.length > 80) {
    response = words.slice(0, 80).join(" ");
    }

    console.log(result.response.text());
}

app.get("/",(req,res) => {
})

app.get('/login', (req,res) => {
    res.sendFile(path.join(__dirname, "../public/login.html"));
})

app.get('/register', (req,res) => {
    res.sendFile(path.join(__dirname, "../public/register.html"));
})

app.post('/api/register',authentication.register)

app.post('/api/login',authentication.login)

app.post('/api/deleteAcount',authentication.deleteAcount)

app.post('/logout', (req,res) => {
    res.clearCookie('jwt');
    res.status(200).send({ status: "ok",redirect:"/" });
})

app.get('/api/auth/check',(req,res) =>{
    const token = req.cookies.jwt;
    if (!token) return res.status(401).send({ loggedIn: false });
    
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).send({ loggedIn: true });
    } catch(err) {
        res.status(401).send({status:"Error",message:"Error en la cookie",loggedIn: false });
    }
}) 

app.get('/protected', (req,res) => {})

app.post('/chat', async(req,res)=>{
    const {message} = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const response = await model.generateContent(message);
    res.send(response.response.text());
});

module.exports = app;