const express = require("express");
const path = require("path");

const rootDir = require("../utils/path");

const route = express.Router();

route.get("/add-product", (req, res, next) => {
    res.sendFile(path.join(rootDir, "views", "add-product.html"));
});

route.post("/add-product", (req, res) => {
    const body = req.body;
    console.log(body);
    res.redirect("/");
});

module.exports = route;
