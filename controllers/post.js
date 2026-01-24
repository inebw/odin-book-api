const { prisma } = require("../lib/prisma");
const { getFollowingHelper } = require("./user");

const createPost = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  await prisma.post.create({
    data: {
      user_id: parseInt(id),
      content,
    },
  });
  res.sendStatus(201);
};

const removeDislikeHelper = async (userId, postId) => {
  await prisma.post.update({
    where: {
      id: parseInt(postId),
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

const removeLikeHelper = async (userId, postId) => {
  await prisma.post.update({
    where: {
      id: parseInt(postId),
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

const likePost = async (req, res) => {
  const { postId, userId } = req.params;
  await removeDislikeHelper(userId, postId);
  await prisma.post.update({
    where: {
      id: parseInt(postId),
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

const dislikePost = async (req, res) => {
  const { postId, userId } = req.params;
  await removeLikeHelper(userId, postId);
  await prisma.post.update({
    where: {
      id: parseInt(postId),
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

const getPostLikes = async (req, res) => {
  const { id } = req.params;
  const postLikes = await prisma.post.findUnique({
    where: {
      id: parseInt(id),
    },
    select: {
      likes: {
        select: {
          id: true,
        },
      },
    },
  });
  res.json(postLikes.likes.map((user) => user.id));
};

const removeDislike = async (req, res) => {
  const { userId, postId } = req.params;
  await removeDislikeHelper(userId, postId);
  res.sendStatus(204);
};

const removeLike = async (req, res) => {
  const { postId, userId } = req.params;
  removeLikeHelper(userId, postId);
  res.sendStatus(204);
};

const getPostDislikes = async (req, res) => {
  const { id } = req.params;
  const postLikes = await prisma.post.findUnique({
    where: {
      id: parseInt(id),
    },
    select: {
      dislikes: {
        select: {
          id: true,
        },
      },
    },
  });
  res.json(postLikes.dislikes.map((user) => user.id));
};

const getFollowerPosts = async (req, res) => {
  const { id } = req.params;
  const followers = await getFollowingHelper(id);
  const posts = await prisma.post.findMany({
    where: {
      user_id: {
        in: followers,
      },
    },
    orderBy: {
      id: "desc",
    },
  });
  res.json(posts);
};

const getTrendingPosts = async (req, res) => {
  const posts = await prisma.post.findMany({
    where: {
      timestamp: {
        gte: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    },
    include: {
      _count: {
        select: {
          likes: true,
        },
      },
    },
    orderBy: {
      likes: {
        _count: "desc",
      },
    },
  });
  res.json(posts);
};

module.exports = {
  createPost,
  getFollowerPosts,
  getTrendingPosts,
  likePost,
  getPostLikes,
  dislikePost,
  getPostDislikes,
  removeLike,
  removeDislike,
};
