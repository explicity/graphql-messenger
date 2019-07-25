const newMessageSubscribe = (parent, args, context, info) => {
  return context.prisma.$subscribe
    .message({
      mutation_in: ['CREATED']
    })
    .node();
};

const newMessageActionSubscribe = (parent, args, context, info) => {
  return context.prisma.$subscribe
    .message({
      mutation_in: ['UPDATED']
    })
    .node();
};

const newReplySubscribe = (parent, args, context, info) => {
  return context.prisma.$subscribe
    .reply({
      mutation_in: ['CREATED']
    })
    .node();
};

const newMessageAction = {
  subscribe: newMessageActionSubscribe,
  resolve: payload => {
    return payload;
  }
};

const newMessage = {
  subscribe: newMessageSubscribe,
  resolve: payload => {
    return payload;
  }
};

const newReply = {
  subscribe: newReplySubscribe,
  resolve: payload => {
    return payload;
  }
};

module.exports = {
  newMessage,
  newMessageAction,
  newReply
};
