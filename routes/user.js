const { Router } = require("express");
const {
  followUser,
  unfollowUser,
  getFollowing,
  getAuthenticatedUser,
  deAuthenticateUser,
  updateUser,
  getFollowers,
  getAllUsers,
  getUserByUsername,
} = require("../controllers/user");
const passport = require("passport");

const user = Router();

user.get(
  "/authenticate",
  passport.authenticate("jwt", { session: false }),
  getAuthenticatedUser,
);
user.delete("/unAuthenticate", deAuthenticateUser);
user.get('/username/:username', getUserByUsername)
user.get("/allUsers", getAllUsers);
user.post(
  "/update/:id",
  passport.authenticate("jwt", { session: false }),
  updateUser,
);
user.post("/follow/:userId/:followerId", followUser);
user.post("/unfollow/:userId/:followerId", unfollowUser);
user.get("/following/:id", getFollowing);
user.get("/followers/:id", getFollowers);

module.exports = user;
