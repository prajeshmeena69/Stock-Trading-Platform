const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Stock = require("../models/Stock");

dotenv.config();

const stocks = [
  { symbol: "RELIANCE", name: "Reliance Industries Ltd", currentPrice: 2850.75, previousClose: 2820.50, sector: "Energy" },
  { symbol: "TCS", name: "Tata Consultancy Services", currentPrice: 3920.40, previousClose: 3890.00, sector: "Technology" },
  { symbol: "INFY", name: "Infosys Ltd", currentPrice: 1478.90, previousClose: 1465.30, sector: "Technology" },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd", currentPrice: 1642.55, previousClose: 1630.20, sector: "Banking" },
  { symbol: "ICICIBANK", name: "ICICI Bank Ltd", currentPrice: 1085.30, previousClose: 1072.45, sector: "Banking" },
  { symbol: "WIPRO", name: "Wipro Ltd", currentPrice: 456.80, previousClose: 451.25, sector: "Technology" },
  { symbol: "TATAMOTORS", name: "Tata Motors Ltd", currentPrice: 812.60, previousClose: 798.90, sector: "Automobile" },
  { symbol: "BAJFINANCE", name: "Bajaj Finance Ltd", currentPrice: 6985.45, previousClose: 6920.30, sector: "Finance" },
  { symbol: "SBIN", name: "State Bank of India", currentPrice: 745.20, previousClose: 738.60, sector: "Banking" },
  { symbol: "ADANIENT", name: "Adani Enterprises Ltd", currentPrice: 2456.75, previousClose: 2410.50, sector: "Conglomerate" },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever Ltd", currentPrice: 2340.10, previousClose: 2318.75, sector: "FMCG" },
  { symbol: "SUNPHARMA", name: "Sun Pharmaceutical Industries", currentPrice: 1678.45, previousClose: 1654.20, sector: "Pharma" },
  { symbol: "ONGC", name: "Oil & Natural Gas Corporation", currentPrice: 267.35, previousClose: 264.80, sector: "Energy" },
  { symbol: "MARUTI", name: "Maruti Suzuki India Ltd", currentPrice: 10845.60, previousClose: 10720.30, sector: "Automobile" },
  { symbol: "NTPC", name: "NTPC Ltd", currentPrice: 378.90, previousClose: 374.25, sector: "Energy" },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    await Stock.deleteMany({});
    console.log("🗑️  Cleared existing stocks");

    await Stock.insertMany(stocks);
    console.log("✅ 15 Stocks seeded successfully!");

    stocks.forEach(s => console.log(`   → ${s.symbol} - ₹${s.currentPrice}`));

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
};

seedDB();