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

describe('Register',()=>{
    test('Succesful Login', async () =>{
        const response = await request(app).post('/api/register').send({
            email:"1@1",
            password:"1"
        });
        expect(response.statusCode).toBe(201);
    })
    
    test('Fail Login', async () =>{
        const response = await request(app).post('/api/register').send({
            email:"1@1",
            password:"123"
        });
        expect(response.statusCode).toBe(400);
    })

    

})