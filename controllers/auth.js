const { User } = require("../models/user");
const bycript = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  secure: false,
  auth: {
    user: "4b79854a7b0376",
    pass: "bcacc6eebe86d8",
  },
});

exports.getLoginPage = (req, res) => {
  const flashMessages = req.flash("error");
  let message;
  if (flashMessages.length !== 0) {
    message = flashMessages;
    console.log(message);
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
  });
};

exports.postLogin = async (req, res) => {
  // get the email and password field
  // check if the email exists
  // check if the password match
  // if all the check is successfull the redirect to the index page
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });
  if (user) {
    const doPasswordMatch = await bycript.compare(password, user.password);
    if (!doPasswordMatch) {
      req.flash("error", "Password is incorrect");
      return res.redirect("/login");
    }

    req.session.user = user;
    req.session.isLoggedIn = true;
    await req.session.save();
    return res.redirect("/products");
  }

  req.flash("error", "Email Does not exists");
  res.redirect("/login");
};

exports.getSignUpPage = (req, res) => {
  const flashMessages = req.flash("error");
  let message;
  if (flashMessages.length !== 0) {
    message = flashMessages;
    console.log(message);
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "SignUp",
    errorMessage: message,
  });
};

exports.postSignUp = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  try {
    const isUserPresent = await User.findOne({ email: email });
    if (isUserPresent) {
      req.flash("error", "This User Exists!!");
      return res.redirect("/signup");
    }
    const hashedPassword = await bycript.hash(password, 12);

    const newUser = new User({
      email,
      name: "Sunny",
      password: hashedPassword,
      cart: { items: [] },
    });
    await newUser.save();

    transporter.sendMail({
      from: `"sandbox.smtp.mailtrap.io 👻" < sandbox.smtp.mailtrap.io>`, // sender address
      to: email, // list of receivers
      subject: "Hello Dear ✔", // Subject line
      text: "Thanks for registering ?", // plain text body
      html: `
        <div>
          <p>From Node Shopping</p>
          <h2>Thank you for your registration, We hope to serve you the best</h2>        
        </div>
      `, // html body
    });

    return res.redirect("/login");
  } catch (error) {
    console.log(error.message);
  }
};

exports.postLogout = async (req, res) => {
  await req.session.destroy();

  res.redirect("/login");
};

exports.getResetPage = async (req, res) => {
  const flashMessages = req.flash("error");
  let message;
  if (flashMessages.length !== 0) {
    message = flashMessages;
    console.log(message);
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
};

exports.postReset = async (req, res) => {
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      req.flash("error", "something went wrong");
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      req.flash("error", "No Account with that email found!");
      return res.redirect("/reset");
    }
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000;
    await user.save();

    // send the reset passwod link to the email
    transporter.sendMail({
      from: `"sandbox.smtp.mailtrap.io 👻" < sandbox.smtp.mailtrap.io>`, // sender address
      to: req.body.email, // list of receivers
      subject: "Hello Dear ✔", // Subject line
      text: "Thanks for registering ?", // plain text body
      html: `
        <div>
          <h3>You Requested from a password reset</h3>
          <p>click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password </p>        
        </div>
      `, // html body
    });
    req.flash("error", "A password reset link have been sent to your email");
    res.redirect("/reset");
  });
};

exports.getNewPasswordPage = async (req, res) => {
  const token = req.params.token;
  const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });

  if (!user) {
    return res.redirect("/404");
  }

  const flashMessages = req.flash("error");
  let message;
  if (flashMessages.length !== 0) {
    message = flashMessages;
    console.log(message);
  }
  res.render("auth/new-password", {
    path: "/new-password",
    pageTitle: "New Password",
    errorMessage: message,
    userId: user._id,
    token: token,
  });
};

exports.postNewPassword = async (req, res) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const token = req.body.token;

  try {
    const user = await User.findOne({
      _id: userId,
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      req.flash("error", "User not Found");
      return res.redirect(req.url);
    }

    const hashedPassword = await bycript.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
    res.redirect("/login");
  } catch (error) {
    console.log(error);
  }
};
