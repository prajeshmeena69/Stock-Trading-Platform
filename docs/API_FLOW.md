# API Flow — Stock Trading Platform

## Base URL
```
http://localhost:5000/api
```

## Auth Routes
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /auth/register | Public | Create new account |
| POST | /auth/login | Public | Login and get JWT |
| GET | /auth/me | Protected | Get current user |

## Stock Routes
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /stocks | Public | Get all stocks |
| GET | /stocks/:symbol | Public | Get single stock |
| POST | /stocks | Admin | Add new stock |
| PUT | /stocks/:symbol | Admin | Update stock price |

## Trade Routes
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /trade/buy | Protected | Buy shares |
| POST | /trade/sell | Protected | Sell shares |
| GET | /trade/portfolio | Protected | Get holdings |
| GET | /trade/transactions | Protected | Get trade history |

## Admin Routes
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /admin/stats | Admin | Dashboard stats |
| GET | /admin/users | Admin | All users |
| PATCH | /admin/users/:id/toggle | Admin | Activate/deactivate user |
| GET | /admin/transactions | Admin | All transactions |
| GET | /admin/stocks | Admin | All stocks |
| POST | /admin/stocks | Admin | Add stock |

## Authentication Flow
```
User submits login form
        ↓
Backend validates credentials
        ↓
JWT token generated (7 day expiry)
        ↓
Token stored in localStorage
        ↓
Every API request sends: Authorization: Bearer <token>
        ↓
authMiddleware.js verifies token
        ↓
req.user set → controller executes
```