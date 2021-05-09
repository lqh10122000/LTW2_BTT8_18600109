const express = require("express");
const User = require("../models/users");

module.exports = function auth(req, res, next) {
  res.locals.currentUser = null;
};
