const express = require("express");
const router = express.Router();

const { list } = require("../controllers/categoryController");

router.get("/getallcategories", list);

module.exports = router;
