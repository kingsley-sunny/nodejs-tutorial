const express = require("express");
const {
  getLoginPage,
  postLogin,
  getSignUpPage,
  postSignUp,
  postLogout,
  getResetPage,
  postReset,
  getNewPasswordPage,
  postNewPassword,
} = require("../controllers/auth");

const router = express.Router();

router.get("/login", getLoginPage);

router.post("/login", postLogin);

router.get("/signup", getSignUpPage);

router.post("/signup", postSignUp);

router.post("/logout", postLogout);

router.get("/reset", getResetPage);

router.post("/reset", postReset);

router.get("/reset/:token", getNewPasswordPage);

router.post("/new-password", postNewPassword);

exports.authRoutes = router;
