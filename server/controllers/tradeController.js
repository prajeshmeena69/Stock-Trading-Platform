const User = require("../models/User");
const Stock = require("../models/Stock");
const Portfolio = require("../models/Portfolio");
const Transaction = require("../models/Transaction");

// @route POST /api/trade/buy
const buyStock = async (req, res) => {
  try {
    const { symbol, quantity } = req.body;

    if (!symbol || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Valid symbol and quantity required" });
    }

    const stock = await Stock.findOne({ symbol: symbol.toUpperCase(), isActive: true });
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    const user = await User.findById(req.user.id);
    const totalCost = stock.currentPrice * quantity;

    if (user.balance < totalCost) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct balance
    user.balance -= totalCost;
    await user.save();

    // Update portfolio
    let holding = await Portfolio.findOne({ user: user._id, symbol: stock.symbol });

    if (holding) {
      const newTotalInvested = holding.totalInvested + totalCost;
      const newQuantity = holding.quantity + quantity;
      holding.averageBuyPrice = newTotalInvested / newQuantity;
      holding.quantity = newQuantity;
      holding.totalInvested = newTotalInvested;
      await holding.save();
    } else {
      await Portfolio.create({
        user: user._id,
        stock: stock._id,
        symbol: stock.symbol,
        quantity,
        averageBuyPrice: stock.currentPrice,
        totalInvested: totalCost,
      });
    }

    // Record transaction
    await Transaction.create({
      user: user._id,
      stock: stock._id,
      symbol: stock.symbol,
      type: "BUY",
      quantity,
      price: stock.currentPrice,
      totalAmount: totalCost,
      status: "COMPLETED",
    });

    res.status(200).json({
      message: `Successfully bought ${quantity} shares of ${stock.symbol}`,
      remainingBalance: user.balance,
      totalCost,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route POST /api/trade/sell
const sellStock = async (req, res) => {
  try {
    const { symbol, quantity } = req.body;

    if (!symbol || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Valid symbol and quantity required" });
    }

    const stock = await Stock.findOne({ symbol: symbol.toUpperCase(), isActive: true });
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    const user = await User.findById(req.user.id);
    const holding = await Portfolio.findOne({ user: user._id, symbol: stock.symbol });

    if (!holding || holding.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient shares to sell" });
    }

    const totalRevenue = stock.currentPrice * quantity;

    // Credit balance
    user.balance += totalRevenue;
    await user.save();

    // Update portfolio
    holding.quantity -= quantity;
    holding.totalInvested -= holding.averageBuyPrice * quantity;

    if (holding.quantity === 0) {
      await Portfolio.deleteOne({ _id: holding._id });
    } else {
      await holding.save();
    }

    // Record transaction
    await Transaction.create({
      user: user._id,
      stock: stock._id,
      symbol: stock.symbol,
      type: "SELL",
      quantity,
      price: stock.currentPrice,
      totalAmount: totalRevenue,
      status: "COMPLETED",
    });

    res.status(200).json({
      message: `Successfully sold ${quantity} shares of ${stock.symbol}`,
      updatedBalance: user.balance,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route GET /api/trade/portfolio
const getPortfolio = async (req, res) => {
  try {
    const holdings = await Portfolio.find({ user: req.user.id }).populate("stock", "currentPrice name symbol");

    const portfolioData = holdings.map((h) => {
      const currentValue = h.stock.currentPrice * h.quantity;
      const profitLoss = currentValue - h.totalInvested;
      const profitLossPercent = ((profitLoss / h.totalInvested) * 100).toFixed(2);

      return {
        symbol: h.symbol,
        name: h.stock.name,
        quantity: h.quantity,
        averageBuyPrice: h.averageBuyPrice,
        currentPrice: h.stock.currentPrice,
        totalInvested: h.totalInvested,
        currentValue,
        profitLoss,
        profitLossPercent: parseFloat(profitLossPercent),
      };
    });

    res.status(200).json(portfolioData);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route GET /api/trade/transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("stock", "name symbol");

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { buyStock, sellStock, getPortfolio, getTransactions };