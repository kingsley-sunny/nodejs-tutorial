const express = require("express");

const HTML = require("../htmlStrings");

const route = express.Router();

route.get("/add-product", (req, res, next) => {
    res.send(HTML.formHTML);
    // next(); // This allows the next functions to continue to another middleware in line
});

route.post("/add-product", (req, res) => {
    const body = req.body;
    console.log(body);
    res.redirect("/");
});

module.exports = route;
