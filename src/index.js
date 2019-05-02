const { GraphQLServer } = require("graphql-yoga");

// placeholder constant for links in memory, no DB yet
let links = [
  {
    id: "link-0",
    url: "www.www",
    description: "Fullstack tutorial for GQL"
  },
  {
    id: "link-1",
    url: "www.test.net",
    description: "YOYO!"
  }
];

let idCount = links.length;

// Resolvers are the "actual implementation" of the schema...
// Notice that the structure is identical to the GQL tag above
// At this point, we're not talking to a real db, so we can do whatever we want here

const resolvers = {
  Query: {
    info: () => "Hacker news clone",
    feed: () => links,
    link: (parent, args) => {
      return links.find(link => link.id === args.id);
    }
  },
  Mutation: {
    // fake a mutation, just push to the in memory list for now as we don't haev a db
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url
      };
      links.push(link);
      return link;
    },

    updateLink: (parent, args) => {
      const linkToUpdate = links.find(link => link.id === args.id);
      const updatedLink = { ...args };
      const newLinks = links.filter(link => link.id !== args.id);
      links = newLinks.concat(updatedLink);
      return updatedLink;
    },

    deleteLink: (parent, args) => {
      const linkToDelete = links.find(link => link.id === args.id);
      links = links.filter(link => link.id !== args.id);
      return linkToDelete;
    }
  }
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers
});

server.start(() => console.log("Server up and running on port 4000"));
