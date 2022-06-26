const express = require("express");
const router = express.Router();
const {
  refreshTokens,
  verifyAccessToken,
  deleteRefreshToken,
} = require("../helpers/jwtHelpers");
const {
  login,
  register,
  getUserInfo,
  updateUserInfo,
  getPurchaseHistory,
  getUserStats,
} = require("../controllers/authController");

router.post("/login", login);
router.get("/profile", verifyAccessToken, getUserInfo);
router.route("/get-user-stats").get(verifyAccessToken, getUserStats);
router.put("/profile/update", verifyAccessToken, updateUserInfo);
router.post("/register", register);
router.post("/refresh-tokens", verifyAccessToken, refreshTokens);
router.get("/myorders", verifyAccessToken, getPurchaseHistory);
router.post("/delete-refresh-token", verifyAccessToken, deleteRefreshToken);

module.exports = router;
