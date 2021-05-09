const express = require("express");
const RoutermainApp = require("./routers/mainApp");
const regRouter = require("./routers/register");
const logRouter = require("./routers/login");
const expressLayouts = require("express-ejs-layouts");
const cookieSession = require("cookie-session");

const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressLayouts);

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_KEY || "secrect"],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

app.set("view engine", "ejs");
app.use("/", RoutermainApp);
app.use("/reg", regRouter);
app.use("/log", logRouter);

app.listen(3000);
