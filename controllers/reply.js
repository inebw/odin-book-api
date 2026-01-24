const { prisma } = require("../lib/prisma");

const createReply = async (req, res) => {
  const { commentId, userId } = req.params;
  const { content } = req.body;
  await prisma.reply.create({
    data: {
      comment_id: parseInt(commentId),
      user_id: parseInt(userId),
      content,
    },
  });
  res.sendStatus(201);
};

const removeReplyDislikeHelper = async (userId, replyId) => {
  await prisma.reply.update({
    where: {
      id: parseInt(replyId),
    },
    data: {
      dislikes: {
        disconnect: {
          id: parseInt(userId),
        },
      },
    },
  });
};

const removeReplyDislike = async (req, res) => {
  const { userId, replyId } = req.params;
  removeReplyDislikeHelper(userId, replyId);
  res.sendStatus(204);
};

const dislikeReply = async (req, res) => {
  const { replyId, userId } = req.params;
  await removeReplyLikeHelper(userId, replyId);
  await prisma.reply.update({
    where: {
      id: parseInt(replyId),
    },
    data: {
      dislikes: {
        connect: {
          id: parseInt(userId),
        },
      },
    },
  });
  res.sendStatus(201);
};

const removeReplyLikeHelper = async (userId, replyId) => {
  await prisma.reply.update({
    where: {
      id: parseInt(replyId),
    },
    data: {
      likes: {
        disconnect: {
          id: parseInt(userId),
        },
      },
    },
  });
};

const removeReplyLike = async (req, res) => {
  const { userId, replyId } = req.params;
  removeReplyLikeHelper(userId, replyId);
  res.sendStatus(204);
};

const getreplies = async (req, res) => {
  const { commentId } = req.params;
  const replies = await prisma.comment.findUnique({
    where: {
      id: parseInt(commentId),
    },
    select: {
      replies: {
        select: {
          id: true,
          content: true,
          user: {
            omit: {
              password: true,
            },
          },
        },
      },
    },
  });
  res.json(replies.replies);
};

const likeReply = async (req, res) => {
  const { replyId, userId } = req.params;
  await removeReplyDislikeHelper(userId, replyId);
  await prisma.reply.update({
    where: {
      id: parseInt(replyId),
    },
    data: {
      likes: {
        connect: {
          id: parseInt(userId),
        },
      },
    },
  });
  res.sendStatus(201);
};

const getReplyLikes = async (req, res) => {
  const { replyId } = req.params;
  const replyLikes = await prisma.reply.findUnique({
    where: {
      id: parseInt(replyId),
    },
    select: {
      likes: {
        select: {
          id: true,
        },
      },
    },
  });
  res.json(replyLikes.likes.map((user) => user.id));
};

const getReplyDislikes = async (req, res) => {
  const { replyId } = req.params;
  const replyDisklikes = await prisma.reply.findUnique({
    where: {
      id: parseInt(replyId),
    },
    select: {
      dislikes: {
        select: {
          id: true,
        },
      },
    },
  });
  res.json(replyDisklikes.dislikes.map((user) => user.id));
};

module.exports = {
  createReply,
  getreplies,
  likeReply,
  getReplyLikes,
  removeReplyLike,
  removeReplyDislike,
  dislikeReply,
  getReplyDislikes,
};
