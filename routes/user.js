const { Router } = require("express");
const {
  followUser,
  unfollowUser,
  getFollowing,
} = require("../controllers/user");

const user = Router();

user.post("/:userId/:followerId", followUser);
user.delete("/:userId/:followerId", unfollowUser);
user.get("/:id", getFollowing);

module.exports = user;
