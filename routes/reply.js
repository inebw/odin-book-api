const { Router } = require("express");
const {
  createReply,
  getreplies,
  likeReply,
  getReplyLikes,
  dislikeReply,
  removeReplyDislike,
  getReplyDislikes,
  removeReplyLike,
} = require("../controllers/reply");

const reply = Router();

reply.post("/:commentId/:userId", createReply);
reply.get("/:commentId", getreplies);
reply.post("/like/:replyId/:userId", likeReply);
reply.delete("/like/:replyId/:userId", removeReplyLike);
reply.get("/like/:replyId", getReplyLikes);
reply.post("/dislike/:replyId/:userId", dislikeReply);
reply.delete("/dislike/:replyId/:userId", removeReplyDislike);
reply.get("/dislike/:replyId", getReplyDislikes);

module.exports = reply;
