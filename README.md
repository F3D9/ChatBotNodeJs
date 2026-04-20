# AI Chatbot — Node.js, TypeScript & Gemini API

Backend of an **AI-powered chatbot** built with **Node.js, Express and TypeScript**.
The API allows users to register, log in, and chat with an assistant powered by **Google Gemini**. Conversations are **saved per user**, enabling persistent chat history and multi-turn context.
The project also includes a **frontend built with HTML, CSS and JavaScript**, providing a fully functional chat interface directly in the browser.

This project was created as part of my work and learning as a **Backend Developer**, focusing on clean architecture, secure authentication, persistent data and cloud deployment.

🌐 **Live demo:**
https://chatbotnodejs.up.railway.app

---

# Features

* User registration and authentication
* Chat with AI using Google Gemini
* **Persistent chat history** — conversations saved and retrieved per user
* Multi-turn context — the assistant remembers previous messages in a session
* JWT-based authentication
* Secure password hashing with **bcrypt**
* Role-based authorization
* PostgreSQL database
* Docker containerization
* Railway deployment
* **Frontend interface** built with HTML, CSS and JavaScript

---

# Tech Stack

* **Node.js + TypeScript** — backend runtime and language
* **Express.js** — REST API framework
* **PostgreSQL** — relational database
* **Neon** — serverless PostgreSQL hosting
* **Google Gemini API** — AI language model
* **JWT (JSON Web Tokens)** — token-based authentication
* **bcrypt** — secure password hashing
* **Vitest** — unit and integration testing
* **Docker & Docker Compose** — containers and reproducible environment
* **Railway** — deployment platform
* **HTML, CSS, JavaScript** — frontend interface

---

# Architecture

```
Client (Browser — HTML/CSS/JS)
          │
          ▼
     Node.js API
   (Express + TypeScript)
          │
   ┌──────┴──────────┐
   ▼                 ▼
PostgreSQL        Gemini API
   (Neon)          (Google)
```

---

# Security & Authentication

The application implements a secure authentication system:

* **bcrypt** for hashed password storage
* **JWT** for stateless session management
* Tokens signed with **JWT_SECRET** and configurable expiration
* Auth middleware protecting private routes
* Role-based authorization for access control
* Input validation and secure endpoint design

---

# Chat History

Each authenticated user has their own conversation history stored in PostgreSQL:

* Chats are saved after each interaction
* Full history is retrieved on login or page load
* Multi-turn context is passed to Gemini on each request
* Schema designed for efficient querying and relational integrity


---

# Running Locally

## Requirements

* Docker

* Git

## 1. Clone the repository

```bash
git clone <REPOSITORY_URL>
cd <REPOSITORY_NAME>
```

## 2. Create environment file

Create a `.env` file at the root of the project and add the required variables listed above.

## 3. Build the containers

First run:

```bash
docker compose up --build
```

## 4. Start the application

After the first build:

```bash
docker compose up
```

---

# Deployment

* **Railway** — backend hosting
* **Neon** — PostgreSQL database

Live at: https://chatbotnodejs.up.railway.app

---

# Goals

This project was built to practice and demonstrate skills in:

* REST API design
* Secure authentication and authorization
* Integration with external AI services (Google Gemini)
* Persistent data storage and relational database design
* Docker containerization
* Cloud deployment

---

# Author

**Federico Salgado — Backend Developer**

Feel free to check out my other projects on [GitHub](https://github.com/F3D9).
