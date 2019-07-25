const newMessageSubscribe = (parent, args, context, info) => {
  return context.prisma.$subscribe
    .message({
      mutation_in: ['CREATED']
    })
    .node();
};

const newMessage = {
  subscribe: newMessageSubscribe,
  resolve: payload => {
    return payload;
  }
};

module.exports = {
  newMessage
};
