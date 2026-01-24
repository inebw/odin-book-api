require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const register = require("./routes/register");
const login = require("./routes/login");
const passport = require("passport");
const cors = require("cors");
const post = require("./routes/post.js");
const user = require("./routes/user.js");
const comment = require("./routes/comment.js");
const reply = require("./routes/reply.js");

const port = process.env.PORT || 4000;
const app = express();

const allowedOrigin = ["http://localhost:5173"];
const corsOptions = {
  origin: allowedOrigin,
  credentials: true,
};

app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

require("./config/passport.js")(passport);

app.use("/register", register);
app.use("/login", login);
app.use("/post", post);
app.use("/user", user);
app.use("/comment", comment);
app.use("/reply", reply);

app.listen(port, (err) => {
  if (err) console.log(err);
  else console.log(`Listening on : ${port}`);
});
