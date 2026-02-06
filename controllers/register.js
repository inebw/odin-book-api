const { body, matchedData, validationResult } = require("express-validator");
const { prisma } = require("../lib/prisma");
const bcrypt = require("bcryptjs");
const supabase = require("../config/supabase");

const validateUser = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage("Username should contain at least 3 characters")
    .isAlphanumeric()
    .withMessage("Username should contain only numbers and alphabets")
    .custom(async (value) => {
      const user = await prisma.user.findUnique({ where: { username: value } });
      if (user) throw new Error("Username already exists");
      return true;
    }),
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("First Name should not be empty")
    .isAlpha()
    .withMessage("First Name should only contin alphabets"),
  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("Last Name should not be empty")
    .isAlpha()
    .withMessage("Last Name should only contin alphabets"),
  body("password")
    .isLength({ min: 8, max: 255 })
    .withMessage("Password should contain at least 8 characters"),
  body("confirm_password").custom((value, { req }) => {
    if (value !== req.body.password) throw new Error("Password does not match");
    else return true;
  }),
];

const registerUser = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) res.status(400).json(errors.array());
    else {
      const { username, password, first_name, last_name } = matchedData(req);
      const { dp } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.create({
        data: {
          username,
          first_name,
          last_name,
          password: hashedPassword,
          dp: dp
            ? dp
            : `https://robohash.org/${username}-${first_name}-${last_name}.png`,
        },
      });
      setTimeout(() => {
        res.json([
          { msg: "Account Created Successfully! Please login to continue" },
        ]);
      }, 2000);
    }
  },
];

const uploadPicture = async (req, res) => {
  let fileLink = `https://robohash.org/f${Math.random()}-{first_name}-{last_name}.png`;
  try {
    const { originalname, buffer, mimetype } = req.file;
    if (mimetype.split("/")[0] !== "image")
      throw new Error("Please upload a valiid image");
    const bucket = "user_uploads";
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(`${Date.now()}-${originalname}`, buffer, {
        contentType: mimetype,
        upsert: false,
      });
    if (error) throw new Error(`${error.message}`);

    fileLink = supabase.storage.from(bucket).getPublicUrl(data.path)
      .data.publicUrl;
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
  res.json({ fileLink });
};

module.exports = {
  registerUser,
  validateUser,
  uploadPicture,
};
