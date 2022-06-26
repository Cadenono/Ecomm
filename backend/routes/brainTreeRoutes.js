const express = require("express");
const router = express.Router();
const {
  generateToken,
  processPayment,
} = require("../controllers/braintreeController");

const { verifyAccessToken } = require("../helpers/jwtHelpers");

router.get("/getToken", verifyAccessToken, generateToken);
router.post("/payment", verifyAccessToken, processPayment);
module.exports = router;
