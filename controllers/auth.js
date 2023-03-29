const { User } = require("../models/user");
const bycript = require("bcrypt");
const nodemailer = require("nodemailer");

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
    // const isUserPresent = await User.findOne({ email: email });
    // if (isUserPresent) {
    //   req.flash("error", "This User Exists!!");
    //   return res.redirect("/signup");
    // }
    // const hashedPassword = await bycript.hash(password, 12);

    // const newUser = new User({
    //   email,
    //   name: "Sunny",
    //   password: hashedPassword,
    //   cart: { items: [] },
    // });
    // await newUser.save();

    var transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      secure: false,
      auth: {
        user: "4b79854a7b0376",
        pass: "bcacc6eebe86d8",
      },
    });

    const nack = await transporter.sendMail({
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

    console.log(nack);

    return res.redirect("/login");
  } catch (error) {
    console.log(error.message);
  }
};

exports.postLogout = async (req, res) => {
  await req.session.destroy();

  res.redirect("/login");
};
