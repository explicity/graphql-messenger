const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const Subscription = require('./resolvers/Subscription');
const Message = require('./resolvers/Message');
const Reply = require('./resolvers/Reply');

const resolvers = {
  Query,
  Mutation,
  Subscription,
  Message,
  Reply
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: request => {
    return {
      ...request,
      prisma
    };
  }
});

server.start(() => console.log('http://localhost:4000'));
