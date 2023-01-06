const express = require("express");
const path = require("path");

const rootDir = require("../utils/path");

const route = express.Router();

const products = [];

route.get("/add-product", (req, res, next) => {
    res.render("add-product", {
        documentTitle: "Add Product",
        path: "/admin/add-product",
        layout: false,
    });
});

route.post("/add-product", (req, res) => {
    const body = req.body;
    products.push({ title: body.title, layout: false });
    res.redirect("/");
});

module.exports.adminRoute = route;
module.exports.products = products;
