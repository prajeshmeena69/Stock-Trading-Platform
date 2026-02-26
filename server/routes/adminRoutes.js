const express = require("express");
const router = express.Router();
const { getAllUsers, toggleUserStatus, getAllTransactions, getAdminStats } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { addStock, updateStockPrice, getAllStocks } = require("../controllers/stockController");

router.use(protect, adminOnly);

router.get("/stats", getAdminStats);
router.get("/users", getAllUsers);
router.patch("/users/:id/toggle", toggleUserStatus);
router.get("/transactions", getAllTransactions);
router.get("/stocks", getAllStocks);
router.post("/stocks", addStock);
router.put("/stocks/:symbol", updateStockPrice);

module.exports = router;