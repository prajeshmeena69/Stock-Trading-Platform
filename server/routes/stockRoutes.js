const express = require("express");
const router = express.Router();
const { getAllStocks, getStockBySymbol, addStock, updateStockPrice } = require("../controllers/stockController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getAllStocks);
router.get("/:symbol", getStockBySymbol);
router.post("/", protect, adminOnly, addStock);
router.put("/:symbol", protect, adminOnly, updateStockPrice);

module.exports = router;