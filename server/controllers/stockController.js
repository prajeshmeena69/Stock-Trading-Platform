const Stock = require("../models/Stock");

// @route GET /api/stocks
const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find({ isActive: true });
    res.status(200).json(stocks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route GET /api/stocks/:symbol
const getStockBySymbol = async (req, res) => {
  try {
    const stock = await Stock.findOne({
      symbol: req.params.symbol.toUpperCase(),
      isActive: true,
    });
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }
    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route POST /api/stocks (admin only)
const addStock = async (req, res) => {
  try {
    const { symbol, name, currentPrice, sector } = req.body;

    if (!symbol || !name || !currentPrice) {
      return res.status(400).json({ message: "Symbol, name and price are required" });
    }

    const existing = await Stock.findOne({ symbol: symbol.toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: "Stock already exists" });
    }

    const stock = await Stock.create({
      symbol: symbol.toUpperCase(),
      name,
      currentPrice,
      previousClose: currentPrice,
      sector: sector || "General",
    });

    res.status(201).json({ message: "Stock added successfully", stock });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route PUT /api/stocks/:symbol (admin only - update price)
const updateStockPrice = async (req, res) => {
  try {
    const { currentPrice } = req.body;
    const stock = await Stock.findOne({
      symbol: req.params.symbol.toUpperCase(),
    });

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    const change = currentPrice - stock.previousClose;
    const changePercent = ((change / stock.previousClose) * 100).toFixed(2);

    stock.previousClose = stock.currentPrice;
    stock.currentPrice = currentPrice;
    stock.change = change;
    stock.changePercent = parseFloat(changePercent);

    await stock.save();
    res.status(200).json({ message: "Price updated", stock });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getAllStocks, getStockBySymbol, addStock, updateStockPrice };