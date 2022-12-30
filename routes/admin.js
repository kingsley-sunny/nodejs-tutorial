const express = require("express");
const path = require("path");
const fs = require("fs");

const HTML = require("../htmlStrings");

const route = express.Router();

route.get("/add-product", (req, res, next) => {
    res.sendFile(path.join(__dirname, "../", "views", "add-product.html"));
});

route.post("/add-product", (req, res) => {
    const body = req.body;
    console.log(body?.message);
    fs.writeFile("message.txt", body?.message, err => {
        console.log("error");
    });
    res.redirect("/");
});

module.exports = route;
