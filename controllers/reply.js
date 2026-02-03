const { prisma } = require("../lib/prisma");

const createReply = async (commentId, userId, content) => {
  await prisma.reply.create({
    data: {
      comment_id: parseInt(commentId),
      user_id: parseInt(userId),
      content,
    },
  });
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

const dislikeReply = async (replyId, userId) => {
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

const getreplies = async (commentId) => {
  const replies = await prisma.comment.findUnique({
    where: {
      id: parseInt(commentId),
    },
    include: {
      replies: {
        include: {
          _count: {
            select: {
              likes: true,
              dislikes: true,
            },
          },
          user: {
            omit: {
              password: true,
            },
          },
        },
      },
    },
  });
  return replies.replies;
};

const likeReply = async (replyId, userId) => {
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
  removeReplyLikeHelper,
  removeReplyDislikeHelper,
};
