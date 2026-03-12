const app = require('../source/app.js');
const request = require("supertest")

describe('GET Pages',() =>{

    test('Chat page works', async () => {
        const response = await request(app).get('/').send();
        expect(response.statusCode).toBe(200);
    })

    test('Login page works', async () => {
        const response = await request(app).get('/login').send();
        expect(response.statusCode).toBe(200);
    })

    test('Register page works', async () => {
        const response = await request(app).get('/register').send();
        expect(response.statusCode).toBe(200);
    })

})

describe('Register',()=>{
    test('Succesful Registration', async () =>{
        const response = await request(app).post('/api/register').send({
            user:"prueba",
            email:"prueba@1",
            password:"1"
        });
        expect(response.statusCode).toBe(201);
    })

    test('Fail, Already Register', async () =>{
        const response = await request(app).post('/api/register').send({
            user:"prueba",
            email:"prueba@1",
            password:"13"
        });
        expect(response.statusCode).toBe(400);
    })

    test('Succesful Delete User', async () =>{
        const response = await request(app).post('/api/deleteAcount').send({
            email:"prueba@1",
        });
        expect(response.statusCode).toBe(201);
    })

    test('Fail Delete User', async () =>{
        const response = await request(app).post('/api/deleteAcount').send({
            email:"prueba@1",
        });
        expect(response.statusCode).toBe(400);
    })
    
})

describe('Login',()=>{
    
    test('Fail Login Check', async () =>{
        const response = await request(app).get('/api/auth/check').send();
        expect(response.statusCode).toBe(401);
    })

    test('Succesful Login', async () =>{
        const response = await request(app).post('/api/login').send({
            email:"1@1",
            password:"1"
        });
        expect(response.statusCode).toBe(200);
    })
    
    test('Fail Login', async () =>{
        const response = await request(app).post('/api/login').send({
            email:"1@1",
            password:"123"
        });
        expect(response.statusCode).toBe(400);
    })

    test('Succesful Logout', async () =>{
        const response = await request(app).post('/logout').send({
            email:"1@1",
            password:"1"
        });
        expect(response.statusCode).toBe(200);
    })

    

})