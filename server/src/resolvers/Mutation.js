const postMessage = (parent, args, context) => {
  return context.prisma.createMessage({
    body: args.body,
    likeCounter: 0,
    dislikeCounter: 0
  });
};

module.exports = {
  postMessage
};
