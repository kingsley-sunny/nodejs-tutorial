const express = require("express");
const path = require("path");

const productControllers = require("../controllers/product.controllers");

const route = express.Router();

// app.use is a middle ware
route.get("/", productControllers.getProductsPage);

module.exports = route;
