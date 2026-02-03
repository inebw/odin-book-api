const { prisma } = require("../lib/prisma");

const getChat = async (userId, connectionId) => {
  const chats = await prisma.message.findMany({
    where: {
      OR: [
        {
          AND: [
            { sender_id: parseInt(userId) },
            { receiver_id: parseInt(connectionId) },
          ],
        },
        {
          AND: [
            { sender_id: parseInt(connectionId) },
            { receiver_id: parseInt(userId) },
          ],
        },
      ],
    },
    orderBy: {
      id: "desc",
    },
  });
  return chats;
};

const createChat = async (userId, connectionId, content) => {
  await prisma.message.create({
    data: {
      sender_id: parseInt(userId),
      receiver_id: parseInt(connectionId),
      content,
    },
  });
};

module.exports = {
  getChat,
  createChat,
};
