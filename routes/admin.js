const express = require("express");
const path = require("path");

const productController = require("../controllers/product.controllers");

const router = express.Router();

router.get("/add-product", productController.getAddProductPage);
router.post("/add-product", productController.postAProduct);

module.exports = router;
