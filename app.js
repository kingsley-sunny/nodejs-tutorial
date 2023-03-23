const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const adminRoute = require("./routes/admin");
const errorController = require("./controllers/error");
const { connectToMongodb } = require("./database/database");
const { shopRoute } = require("./routes/shop");
const { User } = require("./models/user");

const app = express();

// we set it to ejs because express has registed the ejs and pug template by default
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(async (req, res, next) => {
  const user = await User.findById("6419acfbb8dd97ef382a3707");
  req.user = new User(user.name, user.email, user.cart, user._id);
  next();
});

app.use("/admin", adminRoute);
app.use(shopRoute);

// The 404 page
app.use(errorController.get404);

connectToMongodb()
  .then(res => {
    console.log("started !!!!!! ");
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
