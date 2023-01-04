const express = require("express");
const path = require("path");

const rootDir = require("../utils/path");
const { products } = require("./admin");

const route = express.Router();

// app.use is a middle ware
route.get("/", (req, res, next) => {
    res.render("shop", { products: products, documentTitle: "My Shop" });
});

module.exports = route;
