const express = require("express");
const router = express.Router();
const { verifyAccessToken } = require("../helpers/jwtHelpers");
const { decreaseQuantity } = require("../controllers/productController");
const { addOrderToUserHistory } = require("../controllers/customerController");
const {
  create,
  listUserOrders,
  listAllOrders,
  updateOrderStatus,
  getStatusValues,
  getOrderStatsByMonth,
  getAmountEarnedByMonth,
} = require("../controllers/orderController");
const { adminMiddleware } = require("../controllers/authController");
router.post(
  "/create",
  verifyAccessToken,
  addOrderToUserHistory,
  decreaseQuantity,
  create
);
router.get("/getmyorders", verifyAccessToken, listUserOrders);
router.put(
  "/update-order-status",
  verifyAccessToken,
  adminMiddleware,
  updateOrderStatus
);
router.get("/getallorders", verifyAccessToken, adminMiddleware, listAllOrders);
router.get("/status-values", verifyAccessToken, getStatusValues);
router.get(
  "/order-stats-by-month",
  verifyAccessToken,
  adminMiddleware,
  getOrderStatsByMonth
);
router.get(
  "/amt-earned-by-month",
  verifyAccessToken,
  adminMiddleware,
  getAmountEarnedByMonth
);
module.exports = router;
