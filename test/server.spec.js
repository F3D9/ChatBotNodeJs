import { describe, it, expect } from "vitest";
import app from '../source/app.js';
import request from "supertest";

describe('GET Pages',() =>{

    it('Chat page works', async () => {
        const response = await request(app).get('/').send();
        expect(response.statusCode).toBe(200);
    })

    it('Login page works', async () => {
        const response = await request(app).get('/login').send();
        expect(response.statusCode).toBe(200);
    })

    it('Register page works', async () => {
        const response = await request(app).get('/register').send();
        expect(response.statusCode).toBe(200);
    })

})

describe('Register',()=>{
    it('Succesful Registration', async () =>{
        const response = await request(app).post('/api/register').send({
            user:"prueba",
            email:"prueba@1",
            password:"1"
        });
        expect(response.statusCode).toBe(201);
    })

    it('Fail, Already Register', async () =>{
        const response = await request(app).post('/api/register').send({
            user:"prueba",
            email:"prueba@1",
            password:"13"
        });
        expect(response.statusCode).toBe(400);
    })

    it('Succesful Delete User', async () =>{
        const response = await request(app).post('/api/deleteAcount').send({
            email:"prueba@1",
        });
        expect(response.statusCode).toBe(201);
    })

    it('Fail Delete User', async () =>{
        const response = await request(app).post('/api/deleteAcount').send({
            email:"prueba@1",
        });
        expect(response.statusCode).toBe(400);
    })
    
})

describe('Login',()=>{
    
    it('Fail Login Check', async () =>{
        const response = await request(app).get('/api/auth/check').send();
        expect(response.statusCode).toBe(401);
    })

    it('Succesful Login', async () =>{
        const response = await request(app).post('/api/login').send({
            email:"1@1",
            password:"1"
        });
        expect(response.statusCode).toBe(200);
    })
    
    it('Fail Login', async () =>{
        const response = await request(app).post('/api/login').send({
            email:"1@1",
            password:"123"
        });
        expect(response.statusCode).toBe(400);
    })

    it('Succesful Logout', async () =>{
        const response = await request(app).post('/logout').send({
            email:"1@1",
            password:"1"
        });
        expect(response.statusCode).toBe(200);
    })

    

})