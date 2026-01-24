const { prisma } = require("../lib/prisma");

const followUser = async (req, res) => {
  const { userId, followerId } = req.params;
  await prisma.user.update({
    where: {
      id: parseInt(userId),
    },
    data: {
      following: {
        connect: {
          id: parseInt(followerId),
        },
      },
    },
  });
  res.sendStatus(201);
};

const unfollowUser = async (req, res) => {
  const { userId, followerId } = req.params;
  await prisma.user.update({
    where: {
      id: parseInt(userId),
    },
    data: {
      following: {
        disconnect: {
          id: parseInt(followerId),
        },
      },
    },
  });
  res.sendStatus(204);
};

const getFollowingHelper = async (id) => {
  console;
  const following = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
    select: {
      following: {
        select: {
          id: true,
        },
      },
    },
  });
  return following.following.map((user) => user.id);
};

const getFollowing = async (req, res) => {
  const { id } = req.params;
  const following = await getFollowingHelper(id);
  res.json(following);
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowing,
  getFollowingHelper,
};
