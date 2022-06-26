const express = require("express");
const router = express.Router();

const {
  listAll,
  productById,
  listRelated,
  read,
  list,
  listCategories,
  listBySearch,
  remove,
  update,
  getSoldByCategory,
} = require("../controllers/productController");
const { verifyAccessToken } = require("../helpers/jwtHelpers");

router.get("/", listAll);
router.get("/productlist", list);
router.get("/product/:productId", productById, read);
router.get("/related/:productId", productById, listRelated);
router.get("/categories", listCategories);
router.post("/by/search", listBySearch);
router.delete("/:productId", productById, verifyAccessToken, remove);
router.put("/:productId", productById, verifyAccessToken, update);
router.get("/getproductstats", verifyAccessToken, getSoldByCategory);

module.exports = router;
