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

const likePost = async (userId, postId) => {
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
};

const dislikePost = async (userId, postId) => {
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

const getFollowerPosts = async (id) => {
  const followers = await getFollowingHelper(id);
  followers.push(parseInt(id));
  const posts = await prisma.post.findMany({
    where: {
      user_id: {
        in: followers,
      },
    },
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
    },
    orderBy: {
      id: "desc",
    },
  });
  return posts;
};

const getTrendingPosts = async () => {
  const posts = await prisma.post.findMany({
    where: {
      timestamp: {
        gte: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    },
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
    },
    orderBy: {
      likes: {
        _count: "desc",
      },
    },
  });
  return posts;
};

const getFullPost = async (id) => {
  const post = await prisma.post.findUnique({
    where: {
      id: parseInt(id),
    },
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
  });
  return post;
};

module.exports = {
  createPost,
  getFollowerPosts,
  getTrendingPosts,
  likePost,
  getFullPost,
  getPostLikes,
  dislikePost,
  getPostDislikes,
  removeLike,
  removeDislike,
};
