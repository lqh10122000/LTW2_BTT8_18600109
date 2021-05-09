const express = require("express");
const reg = express.Router();
const nodemailer = require("nodemailer");
const users = require("../models/users");
const asyncHandler = require("express-async-handler");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "ltweb222021@gmail.com",
    pass: "ABCxyz123~",
  },
});

reg.get("/", function (req, res) {
  res.locals.title = "Đăng Ký";
  res.locals.currentUser = null;
  res.render("register");
});

reg.post(
  "/",
  asyncHandler(async function (req, res) {
    const { fullname, email, password } = req.body;

    console.log(fullname, email, password);

    if (fullname && email && password) {
      users.CreateUser(fullname, email, password);
    }

    if (email && password) {
      transporter
        .sendMail({
          from: "ltweb222021@gmail.com",
          to: `${email}`,
          subject: "Hello",
          text: "Hello Wellcome",
          html:
            "<b>Hello Wellcome to my page</b> </br> <h4>Sign Up Success<h4>",
        })
        .then(console.log)
        .catch(console.error);
    }

    res.redirect("/log");
  })
);

module.exports = reg;
