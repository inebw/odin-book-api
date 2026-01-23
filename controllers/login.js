const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { prisma } = require("../lib/prisma");

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return res.status(401).json({ msg: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ msg: "Invalid password entered" });

  const token = jwt.sign({ id: user.id }, process.env.SECRET);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.PROD ? true : false,
    sameSite: process.env.PROD ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  res.json({ msg: "Logged in successfully" });
};

module.exports = {
  loginUser,
};
