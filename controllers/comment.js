const { prisma } = require("../lib/prisma");

const createComment = async (postId, userId, content) => {
  await prisma.comment.create({
    data: {
      post_id: parseInt(postId),
      user_id: parseInt(userId),
      content,
    },
  });
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

const dislikeComment = async (commentId, userId) => {
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

const getComments = async (postId) => {
  const comments = await prisma.post.findUnique({
    where: {
      id: parseInt(postId),
    },
    select: {
      comments: {
        include: {
          user: {
            omit: {
              password: true,
            },
          },
          _count: {
            select: {
              likes: true,
              dislikes: true,
            },
          },
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
            orderBy: {
              id: "desc",
            },
          },
        },
        orderBy: {
          id: "desc",
        },
      },
    },
  });
  return comments.comments;
};

const likeComment = async (commentId, userId) => {
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
