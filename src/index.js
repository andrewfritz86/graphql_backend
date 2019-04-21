const { GraphQLServer } = require("graphql-yoga");

// Here we define our GQL schema...
// We define a simple type of query with a field of info, that is
// a required string

// The schema is the heart of a gql server, required before you
// can build out the server

// Query is a `root type` along with `mutation` and `subscription`
// Think of these root types as entry points; you can only send a gql DB/server
// One of these three types

// Schemas have a *definition* and an *implementation*
const typeDefs = `
    type Query {
        info: String!
    }
`;

// Resolvers are the "actual implementation" of the schema...
// Notice that the structure is identical to the GQL tag above
// At this point, we're not talking to a real db, so we can do whatever we want here

const resolvers = {
  Query: {
    info: () => 2
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => console.log("Server up and running on port 4000"));
