const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB Connected..!");
    return server.listen({ port: PORT });
  })
  .then((res) => {
    console.log(`Server running on ${res.url}`);
  });
