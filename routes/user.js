const { Router } = require("express");
const {
  followUser,
  unfollowUser,
  getFollowing,
  getAuthenticatedUser,
  deAuthenticateUser,
} = require("../controllers/user");
const passport = require("passport");

const user = Router();

user.get(
  "/authenticate",
  passport.authenticate("jwt", { session: false }),
  getAuthenticatedUser,
);
user.delete("/unAuthenticate", deAuthenticateUser);
user.post("/:userId/:followerId", followUser);
user.delete("/:userId/:followerId", unfollowUser);
user.get("/:id", getFollowing);

module.exports = user;
