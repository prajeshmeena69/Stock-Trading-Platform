# Authentication Flow

## Registration
```
1. User fills name, email, password
2. Frontend sends POST /api/auth/register
3. Backend checks if email already exists
4. Password hashed with bcryptjs (salt rounds: 10)
5. User saved to MongoDB with balance: 100000
6. JWT generated and returned
7. Token + user saved to localStorage
8. User redirected to /dashboard
```

## Login
```
1. User fills email, password
2. Frontend sends POST /api/auth/login
3. Backend finds user by email
4. bcrypt.compare() checks password
5. If match → JWT generated and returned
6. Token + user saved to localStorage
7. Admin → /admin, User → /dashboard
```

## Protected Routes
```
1. React ProtectedRoute checks localStorage for user
2. If no user → redirect to /login
3. Every API call sends Bearer token in header
4. authMiddleware.js verifies JWT signature
5. Decoded user ID used to fetch user from DB
6. req.user available in all controllers
```

## Admin Guard
```
adminOnly middleware checks req.user.role === "admin"
If not admin → 403 Forbidden
```