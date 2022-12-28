const express = require("express");

const route = express.Router();

// app.use is a middle ware
route.get("/", (req, res, next) => {
    res.send(
        `<h1>Hello how are you</h1><div><a href="/admin/add-product">Link to add product</a></div>`
    );
});

module.exports = route;
