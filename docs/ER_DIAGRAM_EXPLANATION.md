# Entity Relationship Diagram — Stock Trading Platform

## Entities & Relationships
```
USER
├── _id (ObjectId)
├── name, email, password
├── role: user | admin
├── balance: Number (default: 100000)
└── isActive: Boolean

STOCK
├── _id (ObjectId)
├── symbol (unique, uppercase)
├── name, sector
├── currentPrice, previousClose
├── change, changePercent
└── isActive: Boolean

PORTFOLIO
├── _id (ObjectId)
├── user → ref: User ──────────┐
├── stock → ref: Stock ─────┐  │
├── symbol                  │  │
├── quantity                │  │
├── averageBuyPrice         │  │
└── totalInvested           │  │
                            │  │
TRANSACTION                 │  │
├── _id (ObjectId)          │  │
├── user → ref: User ───────┘  │
├── stock → ref: Stock ────────┘
├── symbol
├── type: BUY | SELL
├── quantity, price
├── totalAmount
└── status: COMPLETED
```

## Relationships
- One USER → Many PORTFOLIO entries
- One USER → Many TRANSACTIONS
- One STOCK → Many PORTFOLIO entries
- One STOCK → Many TRANSACTIONS