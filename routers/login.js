const express = require("express");
const log = express.Router();
const asyncHandler = require("express-async-handler");
const User = require("../models/users");

log.get("/", function (req, res) {
  res.locals.title = "Đăng Nhập";
  res.locals.currentUser = null;
  res.render("login");
});

log.post(
  "/",
  asyncHandler(async function (req, res, next) {
    const { email, password } = req.body;
    if (email && password) {
      const user = await User.findByEmail(email);

      // req.session.currentUser = user;
      res.locals.currentUser = user.id;
      req.session.currentUser = user.id;
      console.log(user.id);

      if (user.password === password) {
        res.locals.currentUser = user.id;
        res.redirect("/");
      }
    }
  })
);

module.exports = log;
