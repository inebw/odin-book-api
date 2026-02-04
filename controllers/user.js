const { prisma } = require("../lib/prisma");
const { body, matchedData, validationResult } = require("express-validator");

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

const validateUser = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage("Username should contain at least 3 characters")
    .custom(async (value, { req }) => {
      if (req.user.username == value) return true;
      const user = await prisma.user.findUnique({ where: { username: value } });
      if (user) throw new Error("Username already exists");
      return true;
    }),
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("First Name should not be empty")
    .isAlpha()
    .withMessage("First Name should only contin alphabets"),
  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("Last Name should not be empty")
    .isAlpha()
    .withMessage("Last Name should only contin alphabets"),
];

const updateUser = [
  validateUser,
  async (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) res.json(errors.array());
    else {
      const { username, first_name, last_name } = matchedData(req);
      const { dp } = req.body;

      await prisma.user.update({
        where: {
          id: parseInt(id),
        },
        data: {
          username,
          first_name,
          last_name,
          dp: dp
            ? dp
            : `https://robohash.org/${username}-${first_name}-${last_name}.png`,
        },
      });
      res.json([{ msg: "Account updated sucessfully" }]);
    }
  },
];

const getAuthenticatedUser = async (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username,
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    dp: req.user.dp,
  });
};

const deAuthenticateUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.PROD ? true : false,
    sameSite: process.env.PROD ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  res.json({ msg: "Logged Out Successfully!" });
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
  const following = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
    select: {
      following: {
        omit: {
          password: true,
        },
      },
    },
  });
  res.json(following.following);
};

const getFollowers = async (req, res) => {
  const { id } = req.params;
  const followers = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
    select: {
      follwers: {
        omit: {
          password: true,
        },
      },
    },
  });
  res.json(followers.follwers);
};

const getConnections = async (userId) => {
  const connections = await prisma.user.findUnique({
    where: {
      id: parseInt(userId),
    },
    include: {
      follwers: {
        omit: {
          password: true,
        },
      },
      following: {
        omit: {
          password: true,
        },
      },
    },
  });

  const uniqueConnections = [
    ...new Map(
      [...connections.follwers, ...connections.following].map((u) => [u.id, u]),
    ).values(),
  ];
  return uniqueConnections;
};

const getAllUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    omit: {
      password: true,
    },
  });
  res.json(users);
};

const turnUserOnline = async (userId) => {
  await prisma.user.update({
    where: {
      id: parseInt(userId),
    },
    data: {
      online: true,
    },
  });
};

const turnUserOffline = async (userId) => {
  await prisma.user.update({
    where: {
      id: parseInt(userId),
    },
    data: {
      online: false,
    },
  });
};

const getUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(userId),
    },
    include: {
      following: {
        select: {
          id: true,
        },
      },
      follwers: {
        select: {
          id: true,
        },
      },
    },
    omit: {
      password: true,
    },
  });
  return user;
};

const getUserByUsername = async (req, res) => {
  const { username } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    include: {
      _count: {
        select: {
          following: true,
          follwers: true,
        },
      },
    },
    omit: {
      password: true,
    },
  });
  res.json(user);
};

module.exports = {
  getUser,
  getUserByUsername,
  turnUserOnline,
  turnUserOffline,
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
  getAllUsers,
  getFollowingHelper,
  getAuthenticatedUser,
  deAuthenticateUser,
  updateUser,
  getConnections,
};
