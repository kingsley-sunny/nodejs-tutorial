const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");
const apiRoute = require("./routes/file");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api", apiRoute);
app.use("/admin", adminRoute);
app.use(shopRoute);

// The 404 page
app.use((req, res) => {
    res.status(404).send("<h1>Page not found</h1>");
});

app.listen(3000);
