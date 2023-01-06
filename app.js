const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const expresshandlebars = require("express-handlebars");

const adminData = require("./routes/admin");
const shopRoute = require("./routes/shop");

const app = express();

// we set it to ejs because express has registed the ejs and pug template by default
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/admin", adminData.adminRoute);
app.use(shopRoute);

// The 404 page
app.use((req, res) => {
    res.render("404", { documentTitle: "Page Not Found" });
});

app.listen(3000);
