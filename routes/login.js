const { Router } = require("express");
const { loginUser } = require("../controllers/login");

const login = Router();

login.post("/", loginUser);

module.exports = login;
