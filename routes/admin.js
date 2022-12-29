const express = require("express");
const path = require("path");

const HTML = require("../htmlStrings");

const route = express.Router();

route.get("/add-product", (req, res, next) => {
    res.sendFile(path.join(__dirname, "../", "views", "add-product.html"));
});

route.post("/add-product", (req, res) => {
    const body = req.body;
    console.log(body);
    res.redirect("/");
});

module.exports = route;
