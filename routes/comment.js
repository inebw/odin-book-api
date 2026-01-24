const { Router } = require("express");
const {
  createComment,
  getComments,
  likeComment,
  getCommentLikes,
  removeCommentLike,
  removeCommentDislike,
  dislikeComment,
  getCommentDislikes,
} = require("../controllers/comment");

const comment = Router();

comment.post("/:postId/:userId", createComment);
comment.get("/:postId", getComments);
comment.post("/like/:commentId/:userId", likeComment);
comment.delete("/like/:commentId/:userId", removeCommentLike);
comment.get("/like/:commentId", getCommentLikes);
comment.post("/dislike/:commentId/:userId", dislikeComment);
comment.delete("/dislike/:commentId/:userId", removeCommentDislike);
comment.get("/dislike/:commentId", getCommentDislikes);

module.exports = comment;
