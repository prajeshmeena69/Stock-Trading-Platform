# System Architecture — Stock Trading Platform

## Overview
A full-stack MERN paper trading platform where users trade stocks using virtual money.

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Auth | JWT (JSON Web Tokens) |
| Styling | Inline CSS + CSS Variables |

## Architecture Diagram
```
Client (React + Vite)
        ↓ HTTP Requests (Axios)
Server (Express + Node.js)
        ↓ Mongoose ODM
Database (MongoDB Atlas)
```

## Folder Structure
```
Stock Trading Platform/
├── client/                  ← React Frontend
│   └── src/
│       ├── pages/           ← Full page components
│       ├── components/      ← Reusable components
│       ├── context/         ← Global state (Auth)
│       └── services/        ← API calls (Axios)
└── server/                  ← Express Backend
    ├── config/              ← DB connection
    ├── controllers/         ← Business logic
    ├── models/              ← MongoDB schemas
    ├── routes/              ← API endpoints
    └── middleware/          ← Auth guards
```

## Key Design Decisions
- JWT stored in localStorage for simplicity
- Virtual balance starts at ₹1,00,000 per user
- Paper trading — no real money involved
- Admin role managed via MongoDB user document