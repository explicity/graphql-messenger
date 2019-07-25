const messages = async (parent, args, context) => {
  const where = args.filter
    ? {
        body_contains: args.filter
      }
    : {};
  const messagesList = await context.prisma.messages({
    where: { body_contains: args.filter },
    skip: args.skip,
    first: args.first,
    orderBy: args.orderBy
  });
  const count = await context.prisma
    .messagesConnection({
      where
    })
    .aggregate()
    .count();

  return {
    messagesList,
    count
  };
};

module.exports = { messages };
