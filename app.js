const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const adminRoute = require("./routes/admin");
const errorController = require("./controllers/error");
const { connectToMongodb } = require("./database/database");
const { shopRoute } = require("./routes/shop");
const { User } = require("./models/user");
const { Product } = require("./models/product");
const { authRoutes } = require("./routes/auth");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const csurf = require("csurf");
const flash = require("connect-flash");

const app = express();
const store = new MongoDbStore({ uri: "mongodb://localhost:27017/shop", collection: "sessions" });
const csrf = csurf();

// we set it to ejs because express has registed the ejs and pug template by default
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({ secret: "Sunny", resave: false, saveUninitialized: false, store: store }));
app.use(csrf);

app.use(async (req, res, next) => {
  const formalUser = req.session.user;
  if (formalUser) {
    const user = await User.findById(formalUser._id);
    req.user = user;
  }
  next();
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(flash());

app.use("/admin", adminRoute);
app.use(shopRoute);
app.use(authRoutes);

// The 404 page
app.use(errorController.get404);

(async () => {
  try {
    await connectToMongodb();
    console.log("started !!!!!! ");
    app.listen(3000);
  } catch (error) {
    console.log(error);
  }
})();

// process.kill();

// process.on("uncaughtException", () => {
//   console.log("nakc");
//   process.on("SIGTERM", e => {
//     console.log("hello");
//   });
// });
