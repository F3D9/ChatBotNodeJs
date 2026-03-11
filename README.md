# AI Chatbot Backend (Node.js)

Backend de un **chatbot con inteligencia artificial** desarrollado con **Node.js y Express**.
La API permite a los usuarios registrarse, iniciar sesión y comunicarse con un asistente basado en **Google Gemini**.

Este proyecto fue creado como parte de mi trabajo y aprendizaje como **Backend Developer**, enfocándome en buenas prácticas de desarrollo, autenticación segura y despliegue en la nube.

🌐 **Demo en producción:**
https://chatbotnodejs.up.railway.app

---

# Características

* Registro y autenticación de usuarios
* Chat con IA utilizando Google Gemini
* Autenticación basada en **JWT**
* Hash seguro de contraseñas con **bcrypt**
* Base de datos PostgreSQL
* Contenedorización con Docker
* Deploy en Railway
* Arquitectura backend modular

---

# Tecnologías utilizadas

* **Node.js** – entorno de ejecución del backend
* **Express.js** – framework para construir la API
* **PostgreSQL** – base de datos relacional
* **Neon** – hosting serverless para PostgreSQL
* **Google Gemini API** – modelo de inteligencia artificial
* **JWT (JSON Web Tokens)** – autenticación basada en tokens
* **bcrypt** – hash seguro de contraseñas
* **Docker & Docker Compose** – contenedores y entorno reproducible
* **Railway** – plataforma de despliegue

---

# Arquitectura

La aplicación sigue una arquitectura típica de backend con API REST:

```
Cliente (Frontend / Browser)
          │
          ▼
     Node.js API
      (Express)
          │
   ┌──────┴─────────┐
   ▼                ▼
PostgreSQL       Gemini API
   (Neon)         (Google)
```

---

# Seguridad y Autenticación

La aplicación implementa un sistema de autenticación seguro:

* **bcrypt** para almacenar contraseñas de forma hasheada
* **JWT** para manejar sesiones de usuario
* Tokens firmados con **JWT_SECRET**
* Expiración configurable de tokens
* Autenticación stateless mediante middleware

Esto permite proteger las credenciales de los usuarios y mantener sesiones seguras.

---

# Variables de entorno

El proyecto utiliza las siguientes variables:

```
DATABASE_URL=postgresql_connection_string
GEMINI_API_KEY=google_gemini_api_key

JWT_SECRET=textosecretoDecifrado
JWT_EXPIRATION=7d
JWT_COOKIE_EXPIRES=1

PORT=3000
```

---

# Ejecutar el proyecto localmente

## Requisitos

* Docker
* Docker Compose
* Git

---

## 1. Clonar el repositorio

```
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_REPOSITORIO>
```

---

## 2. Crear archivo de entorno

Crear un archivo `.env` en la raíz del proyecto y agregar las variables necesarias.

---

## 3. Construir los contenedores

Primera ejecución:

```
docker compose up --build
```

---

## 4. Iniciar la aplicación

Luego de la primera build:

```
docker compose up
```

La API quedará disponible en:

```
http://localhost:3000
```

---

# Estructura del proyecto

```
src/
 ├── controllers
 ├── routes
 ├── middleware
 ├── services
 ├── database
 └── app.js

Dockerfile
docker-compose.yml
package.json
```

---

# Deploy

La aplicación está desplegada utilizando:

* **Railway** para el hosting del backend
* **Neon** para la base de datos PostgreSQL

Podés probar la aplicación en:

https://chatbotnodejs.up.railway.app

---

# Objetivo del proyecto

El objetivo de este proyecto fue practicar y demostrar habilidades de **desarrollo backend**, incluyendo:

* diseño de APIs
* autenticación segura
* integración con servicios externos (IA)
* contenedorización con Docker
* despliegue en la nube

---

# Autor

**Backend Developer**

Si te interesa este proyecto o querés ver más trabajos similares, podés visitar mi perfil de GitHub.
