const postMessage = (parent, args, context) => {
  return context.prisma.createMessage({
    body: args.body,
    likeCounter: 0,
    dislikeCounter: 0
  });
};

const postMessageLike = async (parent, args, context, info) => {
  const message = await context.prisma.message({
    id: args.messageId
  });

  if (!message) {
    throw new Error(`Message with ID ${args.messageId} does not exist`);
  }

  return context.prisma.updateMessage({
    where: { id: args.messageId },
    data: { likeCounter: message.likeCounter + 1 }
  });
};

const postMessageDislike = async (parent, args, context, info) => {
  const message = await context.prisma.message({
    id: args.messageId
  });

  if (!message) {
    throw new Error(`Message with ID ${args.messageId} does not exist`);
  }
  
  return context.prisma.updateMessage({
    where: { id: args.messageId },
    data: { dislikeCounter: message.dislikeCounter + 1 }
  });
};

module.exports = {
  postMessage,
  postMessageLike,
  postMessageDislike
};
