const express = require("express");
const fs = require("fs");

const route = express.Router();

route.get("/file", (req, res) => {
    fs.readFile("message.txt", (err, succ) => {
        const text = succ.toLocaleString();

        res.send(text);
    });
});

module.exports = route;
