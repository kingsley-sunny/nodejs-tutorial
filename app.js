const http = require("http");
const requestHandler = require("./routes");
const express = require("express");

const app = express();

// app.use is a middle ware
app.use((req, res, next) => {
    console.log("In the middle ware");
    next(); // This allows the next functions to continue to another middleware in line
});

app.use((req, res, next) => {
    console.log("In the second middle ware");
});

console.log(app.use);

const server = http.createServer(app);

server.listen(3000);
