# Stock Trading Platform

A full-stack MERN paper trading platform where users can trade Indian stocks using ₹1,00,000 virtual capital — zero real money, zero risk.

---

## Live Demo

| Service | URL |
|---|---|
| Frontend | https://stock-trading-platform-1-oq2t.onrender.com |
| Backend API | https://stock-trading-platform-yerx.onrender.com |

---

## Features

### User Features
- JWT Authentication (Register / Login / Logout)
- Start with ₹1,00,000 virtual balance
- Buy & Sell 15+ Indian stocks in real time
- Live Portfolio tracking with P&L per stock
- Complete Transaction history with filters
- Real-time balance updates after every trade

### Admin Features
- Separate Admin Dashboard
- View & manage all users (Activate / Deactivate)
- Add new stocks to the platform
- Monitor all transactions across users
- Platform-wide statistics (Users, Volume, Stocks)

### UI/UX
- Futuristic dark theme with neon cyan accents
- Particle animations, glitch effects, orbital rings
- Typewriter hero text, shimmer stats, scan sweep line
- Responsive design for all screen sizes
- Glassmorphism cards with hover glow effects

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 5 |
| Backend | Node.js + Express 5 |
| Database | MongoDB Atlas |
| Authentication | JWT + bcryptjs |
| Styling | CSS-in-JS + CSS Variables |
| HTTP Client | Axios |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| Deployment | Render (Frontend + Backend) |

---

## Project Structure

```
Stock Trading Platform/
├── client/                        ← React Frontend
│   ├── public/
│   │   └── _redirects             ← Render routing fix
│   └── src/
│       ├── pages/
│       │   ├── Home.jsx           ← Landing page
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx      ← Market + Buy
│       │   ├── Portfolio.jsx      ← Holdings + Sell
│       │   ├── Transactions.jsx   ← Trade history
│       │   └── AdminDashboard.jsx
│       ├── components/
│       │   └── Navbar.jsx
│       ├── context/
│       │   └── AuthContext.jsx    ← Global auth state
│       └── services/
│           └── api.js             ← Axios instance
├── server/                        ← Express Backend
│   ├── config/
│   │   ├── db.js                  ← MongoDB connection
│   │   └── seedStocks.js          ← Seed 15 stocks
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── stockController.js
│   │   ├── tradeController.js
│   │   └── adminController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Stock.js
│   │   ├── Portfolio.js
│   │   ├── Transaction.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── stockRoutes.js
│   │   ├── tradeRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   └── index.js
└── docs/
    ├── SYSTEM_ARCHITECTURE.md
    ├── API_FLOW.md
    ├── AUTH_FLOW.md
    ├── ER_DIAGRAM_EXPLANATION.md
    └── USER_FLOW.md
```

---

## Getting Started Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Git

### 1 — Clone the repository
```bash
git clone https://github.com/prajeshmeena69/Stock-Trading-Platform.git
cd Stock-Trading-Platform
```

### 2 — Setup Backend
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend:
```bash
npm run dev
```

### 3 — Setup Frontend
```bash
cd client
npm install
npm run dev
```

### 4 — Seed the stocks (first time only)
```bash
cd server
npm run seed
```

### 5 — Open in browser
```
http://localhost:5173
```

---

## API Endpoints

### Auth
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Protected |

### Stocks
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/stocks` | Public |
| POST | `/api/stocks` | Admin |

### Trade
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/trade/buy` | Protected |
| POST | `/api/trade/sell` | Protected |
| GET | `/api/trade/portfolio` | Protected |
| GET | `/api/trade/transactions` | Protected |

### Admin
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/admin/stats` | Admin |
| GET | `/api/admin/users` | Admin |
| PATCH | `/api/admin/users/:id/toggle` | Admin |
| GET | `/api/admin/transactions` | Admin |
| GET | `/api/admin/stocks` | Admin |
| POST | `/api/admin/stocks` | Admin |

---

## Database Models

```
USER         → name, email, password, role, balance, isActive
STOCK        → symbol, name, currentPrice, change, sector
PORTFOLIO    → user, stock, quantity, averageBuyPrice, totalInvested
TRANSACTION  → user, stock, type (BUY/SELL), quantity, price, totalAmount
ORDER        → user, stock, orderType, side, status
```

---

## Test Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@stocktrading.com | admin123 |
| User | Register freely | Any password |

---

## Deployment

Both services deployed on Render (Free Tier):

### Backend — Web Service
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `node index.js`
- Environment Variables: `PORT`, `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`

### Frontend — Static Site
- Root Directory: `client`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Environment Variables: `VITE_API_URL`

---

## Documentation

All architecture docs are inside the `/docs` folder:

- `SYSTEM_ARCHITECTURE.md` — High level system design
- `API_FLOW.md` — All API endpoints explained
- `AUTH_FLOW.md` — JWT authentication flow
- `ER_DIAGRAM_EXPLANATION.md` — Database relationships
- `USER_FLOW.md` — Complete user journey

---

## Author

**Prajesh Singh Meena**

- GitHub: https://github.com/prajeshmeena69
- LinkedIn: https://www.linkedin.com/in/prajesh-singh-meena-607437327

---

## Disclaimer

This is a paper trading platform built for educational purposes only. No real money is involved. Stock prices are simulated and do not reflect actual market data.

---

If you found this project helpful, please give it a star on GitHub!
