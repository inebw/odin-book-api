require("dotenv").config();
const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const register = require("./routes/register");
const login = require("./routes/login");
const passport = require("passport");
const cors = require("cors");
const post = require("./routes/post.js");
const user = require("./routes/user.js");
const comment = require("./routes/comment.js");
const reply = require("./routes/reply.js");
const {
  getFollowerPosts,
  getTrendingPosts,
  likePost,
  dislikePost,
  getFullPost,
} = require("./controllers/post.js");
const {
  getComments,
  createComment,
  likeComment,
  dislikeComment,
} = require("./controllers/comment.js");
const {
  createReply,
  getreplies,
  likeReply,
  dislikeReply,
} = require("./controllers/reply.js");

const allowedOrigin = ["http://localhost:5173"];
const corsOptions = {
  origin: allowedOrigin,
  credentials: true,
};

const port = process.env.PORT || 4000;
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

require("./config/passport.js")(passport);

app.use("/register", register);
app.use("/login", login);
app.use("/post", post);
app.use("/user", user);
app.use("/comment", comment);
app.use("/reply", reply);

io.on("connection", (socket) => {
  socket.on("getPosts", async (data) => {
    const posts = data
      ? await getFollowerPosts(data)
      : await getTrendingPosts();
    socket.emit("receivePosts", posts);
  });

  socket.on("getPost", async (data) => {
    const post = await getFullPost(data);
    socket.emit("receivePost", post);
  });

  socket.on("likePost", async (data, cb) => {
    await likePost(data.userId, data.postId);
    cb();
  });

  socket.on("dislikePost", async (data, cb) => {
    await dislikePost(data.userId, data.postId);
    cb();
  });

  socket.on("getComments", async (data) => {
    const comments = await getComments(data);
    socket.emit("receiveComments", comments);
  });

  socket.on("createComment", async (data, cb) => {
    await createComment(data.postId, data.userId, data.content);
    cb();
  });

  socket.on("likeComment", async (data, cb) => {
    await likeComment(data.commentId, data.userId);
    cb();
  });

  socket.on("dislikeComment", async (data, cb) => {
    await dislikeComment(data.commentId, data.userId);
    cb();
  });

  socket.on("createReply", async (data, cb) => {
    await createReply(data.commentId, data.userId, data.content);
    cb();
  });

  socket.on("getReplies", async (data) => {
    const replies = await getreplies(data);
    socket.emit("receiveReplies", replies);
  });

  socket.on("likeReply", async (data, cb) => {
    await likeReply(data.replyId, data.userId);
    cb();
  });

  socket.on("dislikeReply", async (data, cb) => {
    await dislikeReply(data.replyId, data.userId);
    cb();
  });
});

server.listen(port, (err) => {
  if (err) console.log(err);
  else console.log(`Listening on : ${port}`);
});
