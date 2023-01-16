const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");
const errorController = require("./controllers/error");
const { sequelize } = require("./database/database");
const Product = require("./models/product");
const { User } = require("./models/user");

const app = express();

// we set it to ejs because express has registed the ejs and pug template by default
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoute);
app.use(shopRoute);

// The 404 page
app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

sequelize
    .sync({ force: true })
    .then(res => {
        app.listen(3000);
    })
    .catch(err => console.log(err));
