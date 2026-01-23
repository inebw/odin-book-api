const { Router } = require("express");
const { registerUser } = require("../controllers/register");

const register = Router();

register.post("/", registerUser);

module.exports = register;
