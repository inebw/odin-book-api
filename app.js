require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const register = require("./routes/register");
const login = require("./routes/login");
const passport = require("passport");

const port = process.env.PORT || 4000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

require("./config/passport.js")(passport);

app.use("/register", register);
app.use("/login", login);

app.listen(port, (err) => {
  if (err) console.log(err);
  else console.log(`Listening on : ${port}`);
});
