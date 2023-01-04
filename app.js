const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const adminData = require("./routes/admin");
const shopRoute = require("./routes/shop");

const app = express();

app.set("view engine", "pug");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/admin", adminData.adminRoute);
app.use(shopRoute);

// The 404 page
app.use((req, res) => {
    res.render("404");
});

app.listen(3000);
