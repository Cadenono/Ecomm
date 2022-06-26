const express = require("express");
const router = express.Router();
const { verifyAccessToken } = require("../helpers/jwtHelpers");
const {
  updateUserInfo,
  getUserInfo,
} = require("../controllers/customerController");

router.get("/getuserinfo", verifyAccessToken, getUserInfo);
router.put("/updatemyinfo", verifyAccessToken, updateUserInfo);

module.exports = router;
