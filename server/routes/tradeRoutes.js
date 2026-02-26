const express = require("express");
const router = express.Router();
const { buyStock, sellStock, getPortfolio, getTransactions } = require("../controllers/tradeController");
const { protect } = require("../middleware/authMiddleware");

router.post("/buy", protect, buyStock);
router.post("/sell", protect, sellStock);
router.get("/portfolio", protect, getPortfolio);
router.get("/transactions", protect, getTransactions);

module.exports = router;