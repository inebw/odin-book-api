const { prisma } = require("../lib/prisma");

const createComment = async (req, res) => {
  const { postId, userId } = req.params;
  const { content } = req.body;
  await prisma.comment.create({
    data: {
      post_id: parseInt(postId),
      user_id: parseInt(userId),
      content,
    },
  });
  res.sendStatus(201);
};

const removeCommentDislikeHelper = async (userId, commentId) => {
  await prisma.comment.update({
    where: {
      id: parseInt(commentId),
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

const removeCommentDislike = async (req, res) => {
  const { userId, commentId } = req.params;
  removeCommentDislikeHelper(userId, commentId);
  res.sendStatus(204);
};

const dislikeComment = async (req, res) => {
  const { commentId, userId } = req.params;
  await removeCommentLikeHelper(userId, commentId);
  await prisma.comment.update({
    where: {
      id: parseInt(commentId),
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

const removeCommentLikeHelper = async (userId, commentId) => {
  await prisma.comment.update({
    where: {
      id: parseInt(commentId),
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

const removeCommentLike = async (req, res) => {
  const { userId, commentId } = req.params;
  removeCommentLikeHelper(userId, commentId);
  res.sendStatus(204);
};

const getComments = async (req, res) => {
  const { postId } = req.params;
  const comments = await prisma.post.findUnique({
    where: {
      id: parseInt(postId),
    },
    select: {
      comments: {
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
  res.json(comments.comments);
};

const likeComment = async (req, res) => {
  const { commentId, userId } = req.params;
  await removeCommentDislikeHelper(userId, commentId);
  await prisma.comment.update({
    where: {
      id: parseInt(commentId),
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

const getCommentLikes = async (req, res) => {
  const { commentId } = req.params;
  const commentLikes = await prisma.comment.findUnique({
    where: {
      id: parseInt(commentId),
    },
    select: {
      likes: {
        select: {
          id: true,
        },
      },
    },
  });
  res.json(commentLikes.likes.map((user) => user.id));
};

const getCommentDislikes = async (req, res) => {
  const { commentId } = req.params;
  const commentDisklikes = await prisma.comment.findUnique({
    where: {
      id: parseInt(commentId),
    },
    select: {
      dislikes: {
        select: {
          id: true,
        },
      },
    },
  });
  res.json(commentDisklikes.dislikes.map((user) => user.id));
};

module.exports = {
  createComment,
  getComments,
  likeComment,
  getCommentLikes,
  removeCommentLike,
  removeCommentDislike,
  dislikeComment,
  getCommentDislikes,
};
