const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const adminRoute = require("./routes/admin");
const errorController = require("./controllers/error");
const { connectToMongodb } = require("./database/database");
const { shopRoute } = require("./routes/shop");
const { User } = require("./models/user");
const { Product } = require("./models/product");

const app = express();

// we set it to ejs because express has registed the ejs and pug template by default
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(async (req, res, next) => {
  const user = await User.findById("641c32d99c35b09294f7be75");
  req.user = user;
  next();
});

app.use("/admin", adminRoute);
app.use(shopRoute);

// The 404 page
app.use(errorController.get404);

(async () => {
  try {
    await connectToMongodb();
    const user = await User.findOne();
    if (!user) {
      await new User({ name: "Sunny", email: "test@gmail.com", cart: { items: [] } }).save();
    }
    console.log("started !!!!!! ");
    app.listen(3000);
  } catch (error) {
    console.log(error);
  }
})();
