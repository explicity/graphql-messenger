const messages = async (parent, args, context) => {
  const where = args.filter
    ? {
        text_contains: args.filter
      }
    : {};
  const messagesList = await context.prisma.messages({
    where,
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
