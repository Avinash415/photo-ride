# 📸 PhotoRide – Backend Service

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

---

## 🚀 Overview

**PhotoRide Backend Service** is a **robust, scalable backend system** for an **Uber-like photography booking platform**, enabling seamless interaction between **customers** and **photographers**.

The service handles **authentication, photographer profile management, booking workflows**, and is fully **Dockerized with an automated CI/CD pipeline** deployed on **Render**.

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (`customer`, `photographer`, `admin`)
- Secure protected routes
- Login, Register, Logout, Get Current User

### 📸 Photographer Management
- Photographer profile creation & updates
- Services & pricing management
- Portfolio image uploads (Multer)
- Availability control
- Public photographer discovery
- Detailed photographer profile view

### 📅 Booking System
- Customers can create booking requests
- Booking lifecycle management:
  - `PENDING`
  - `CONFIRMED`
  - `COMPLETED`
  - `CANCELLED`
- Photographer booking dashboard
- Customer booking history

### 🐳 DevOps & Deployment
- Dockerized backend service
- Docker image published to Docker Hub
- CI/CD pipeline using GitHub Actions
- Automatic deployment to Render
- Environment-based configuration

---

## 🛠 Tech Stack

| Layer | Technology |
|------|-----------|
| Runtime | Node.js (18+) |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT |
| File Uploads | Multer |
| DevOps | Docker, GitHub Actions |
| Hosting | Render |
| Version Control | Git & GitHub |

---

## 📂 Project Structure

```bash
backend/
├── src/
│   ├── config/          # Database & environment config
│   ├── controllers/     # Business logic
│   ├── middlewares/     # Auth, role, upload middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── utils/           # Utility helpers (JWT, etc.)
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
│
├── .env
├── Dockerfile
├── .dockerignore
├── package.json
└── README.md


## 📚 API Documentation
