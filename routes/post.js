const { Router } = require("express");
const {
  createPost,
  getFollowerPosts,
  likePost,
  getPostLikes,
  getPostDislikes,
  dislikePost,
  removeLike,
  removeDislike,
  getTrendingPosts,
} = require("../controllers/post");

const post = Router();

post.post("/:id", createPost);
post.get("/:id", getFollowerPosts);
post.get("/", getTrendingPosts);
post.post("/like/:postId/:userId", likePost);
post.delete("/like/:postId/:userId", removeLike);
post.get("/like/:id", getPostLikes);
post.post("/dislike/:postId/:userId", dislikePost);
post.delete("/dislike/:postId/:userId", removeDislike);
post.get("/dislike/:id", getPostDislikes);

module.exports = post;
