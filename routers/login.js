const express = require("express");
const log = express.Router();
const asyncHandler = require("express-async-handler");
// const User = require("../models/users");
const { Sequelize, Model, DataTypes } = require("sequelize");
const db = new Sequelize(
  "postgres://postgres:lqh2962000@localhost:5432/LTW2_Tuan5"
);

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");

const FACEBOOK_APP_ID = "1193080331115663";
const FACEBOOK_APP_SECRET = "66029dec6441e3a2fcb035f9b452724c";

log.use(cookieParser());
log.use(bodyParser.urlencoded());
log.use(session({ secret: "keyboard cat" }));

class User extends Model {}
User.init(
  {
    displayName: DataTypes.STRING,
    email: DataTypes.STRING,
    facebookID: DataTypes.STRING,
    accessToken: DataTypes.STRING,
  },
  { sequelize: db, modelName: "user" }
);

const passport = require("passport"),
  FacebookStrategy = require("passport-facebook").Strategy;
const e = require("express");

log.use(passport.initialize());
log.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findByPk(id)
    .then(function (user) {
      done(null, user);
    })
    .catch(done);
});

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:5000/auth/facebook/callback",
      profileFields: ["id", "emails", "name", "displayName"],
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({
        where: {
          facebookID: profile.id,
        },
      })
        .then(async function (user) {
          if (!user) {
            user = await User.create({
              displayName: profile.displayName,
              facebookID: profile.id,
              email: profile.emails[0].value,
            });
          }
          user.accessToken = accessToken;
          await user.save();
          done(null, user);
        })
        .catch(done);
      console.log(accessToken, refreshToken, profile);
    }
  )
);

log.get("/facebook", passport.authenticate("facebook", { scope: "email" }));

log.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/auth/successfull",
    failureRedirect: "/log",
  })
);

log.get("/successfull", function (req, res) {
  if (req.user) {
    (async function () {
      const Parser = require("rss-parser");
      const parser = new Parser();

      const feed = await parser.parseURL(
        "https://thanhnien.vn/rss/thoi-su/vuot-qua-covid-19.rss"
      );

      res.locals.currentUser = req.user;
      req.session.currentUser = req.user;
      res.locals.fullName = req.user.displayName;

      res.locals.title = "Thông Tin";

      res.render("mainApp", {
        covids: feed.items,
        title: "MainApp",
      });
    })().catch(console.error);
  } else {
    res.send("login by facebook Demo");
  }
});

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
