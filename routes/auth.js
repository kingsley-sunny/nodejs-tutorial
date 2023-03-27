const express = require("express");
const {
  getLoginPage,
  postLogin,
  getSignUpPage,
  postSignUp,
  postLogout,
} = require("../controllers/auth");

const router = express.Router();

router.get("/login", getLoginPage);

router.post("/login", postLogin);

router.get("/signup", getSignUpPage);

router.post("/signup", postSignUp);

router.post("/logout", postLogout);

exports.authRoutes = router;
