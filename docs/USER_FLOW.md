# User Flow — Stock Trading Platform

## New User Journey
```
Landing → /login
        ↓ Click "Create one free"
/register → Fill name, email, password
        ↓ Submit
Account created → ₹1,00,000 balance assigned
        ↓ Auto redirect
/dashboard → See market + stats
        ↓ Click Buy on any stock
Buy Modal → Enter quantity → Confirm
        ↓ Trade executed
Balance deducted → Portfolio updated → Transaction recorded
        ↓ Navigate to
/portfolio → See holdings + P&L
        ↓ Click Sell
Sell Modal → Enter quantity → Confirm
        ↓ Trade executed
Balance credited → Portfolio updated
        ↓ Navigate to
/transactions → Full trade history
```

## Admin Journey
```
/login → admin@stocktrading.com
        ↓ Role check → admin
/admin → Overview tab (stats)
        ↓
Users tab → View all users → Activate/Deactivate
        ↓
Stocks tab → Add new stock
        ↓
Transactions tab → Monitor all trades
```