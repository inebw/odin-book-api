const { Router } = require("express");
const { registerUser, uploadPicture } = require("../controllers/register");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });
const register = Router();

register.post("/", registerUser);
register.post("/uploadPicture", upload.single("file"), uploadPicture);

module.exports = register;
