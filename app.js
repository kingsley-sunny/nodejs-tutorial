const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");
const errorController = require("./controllers/error");
const { sequelize } = require("./database/database");
const Product = require("./models/product");
const { User } = require("./models/user");
const { Cart } = require("./models/cart");
const { CartItem } = require("./models/cart-item");
const { Orders } = require("./models/orders");
const { OrderItem } = require("./models/orderItem");

const app = express();

// we set it to ejs because express has registed the ejs and pug template by default
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  if (!req.user) {
    User.findByPk(1)
      .then(user => {
        req.user = user;
        req.user.getCart({ where: { id: req.user.id } }).then(res => {
          req.cart = res;
          next();
        });
      })
      .catch(err => console.log(err));
  } else {
    next();
  }
});

app.use("/admin", adminRoute);
app.use(shopRoute);

// The 404 page
app.use(errorController.get404);

User.hasMany(Product);
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem, uniqueKey: false });
Product.belongsToMany(Cart, { through: CartItem, uniqueKey: false });

User.hasMany(Orders);
Orders.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

Orders.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Orders, { through: OrderItem });

const syncToDatabase = async () => {
  try {
    await sequelize
      // .sync({ force: true });
      .sync();
    const user = await User.findByPk(1);
    if (!user) {
      const newUser = await User.create({ name: "BossEkc", email: "test@gmail.com" });
      await Cart.create({ userId: newUser.id });
    }
    app.listen(3000);
  } catch (error) {
    console.log(error);
  }
};

syncToDatabase();
