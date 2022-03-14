const messageResolver = require("./messageResolver");
const userResolver = require("./userResolver");

module.exports = {
  Query: {
    ...messageResolver.Query,
    ...userResolver.Query,
  },
  Mutation: {
    ...messageResolver.Mutation,
    ...userResolver.Mutation,
  },
};
