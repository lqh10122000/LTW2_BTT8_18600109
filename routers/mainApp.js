const express = require("express");
const main = express.Router();

main.get("/", function (req, res) {
  (async function () {
    const Parser = require("rss-parser");
    const parser = new Parser();

    const feed = await parser.parseURL(
      "https://thanhnien.vn/rss/thoi-su/vuot-qua-covid-19.rss"
    );

    if (req.session.currentUser) {
      res.locals.currentUser = req.session.currentUser;
    } else {
      res.locals.currentUser = null;
    }

    res.locals.title = "Thông Tin";

    res.render("mainApp", {
      covids: feed.items,
      title: "MainApp",
    });
  })().catch(console.error);
});

module.exports = main;
