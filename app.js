const express = require("express");
const usersRoute = require("./routes/users");
const indexRoute = require("./routes/index");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use("/users", usersRoute);
app.use("/", indexRoute);

app.listen(3000);
