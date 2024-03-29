# GraphQL intro
- [Solid intro article](https://medium.freecodecamp.org/so-whats-this-graphql-thing-i-keep-hearing-about-baf4d36c20cf)
- GraphQL versus REST
  [article](https://www.howtographql.com/basics/1-graphql-is-the-better-rest/)
  - 1 smart endpoint versus multiple dumb endpoints
  - Solves N + 1 problems
  - No overfetching of data
  - Schema-driven development
  - Strongly typed
- Downsides
  - Large overhead for simpler APIs
  - "More moving parts", moving spec
  - Potential caching issues
    - Browsers easily cache URLs, but gql queries are all POSTs
- GraphQL terminology
  - Schema
    - Defines the API. Any unique types are defined here, alongside the queries and mutations needed to access data.
  - Queries
    - Queries are what you would assume - you send specific queries to request data form the server.
  - Mutations
    - These are a type of query that can mutate/delete data.
  - Resolvers
    - These are functions invoked by queries and mutations. These functions contain the logic to respond to the requests to the API.


# GraphQL backend

## Components

- Graphql-yoga
  - This is a graphql Server. Connects to a GQL db to handle queries and mutations?
  - Sits on top of express to intercept GQL queries to the DB. This provides a layer of safety between raw CRUD operations. Allows for auth, charging CCs, cookies, etc.
  - This is also a Prisma project...
- Prisma - Replaces the traditional ORM. "Use the Prisma client to implement your Graphql resolvers" - GQL yoga is a prisma project...
  GraphQL Playgfound - IDE that lets you play around with a GQL API by responding to queries and mutations - Exposes the schema of the GQL API in real time for exploration

## Overview

- Hacker news API
- Schema definition and resolvers, but these will only persist in memory
- Hook the the GQL server up to a DB via prisma client

## Steps

### Server

In this demo, we build a graphql server, which should not be confused with an actual database. The server sits out in front of any layers that actually interact with your database. Within your server, you write the resolver functions that actually talk to the database and build the response from the API.

Additionally, the graphql server lets you perform operations outside of pure database communication - the server can be thought of as middleware for things like authentication. You can ensure only authorized users have access to the real database.

1. Set up directories
2. Install yoga as a dep
3. Set up the schema, resolvers.
   - The Schema is the heart of the gql setup. It's an abstract description of the server's capabilities. It doesn't allow for any interaction. Resolvers handle that.
   - There are 3 root types: `query` `mutation` and `subscription`. These define the entry points of the server.
   - The schema defines the shape of the DB. The resolver functions are the actual _implementation_ of the schema. Structure versus behavior.
   - Generally, each field of a schema will have a matching resolver function. GQL is essentially a "language for invoking remote functions (resolvers)"
   - `graphql-tools` is library the automatically writes simple resolvers for a given schema (user.id comes for free instead of requiring a distinct resolver)
4. Run IDE and query
   - How come `null` from the resolver throws an error, but an int is ok...?
   - Looks like the int gets cast to a string, JS related, I guess?
5. Add feed to query typeDefs, and create a new type called link
   - Implement the resolvers for the feed, and each field on the Link.
   - Parent responds to the previously resolved level field, so in the Link resolvers, parent is the Link
   - Remember that the parent in the resolvers is the Overall model itself.
   - We aren't actually hooked up to a db yet, so `links` is hardcoded in the file for now
   - Again, every field has a corresponding resolver function
6. Mutations
   - Refactor schema into its own file and reference it.
   - We can remove the links resolver, because the yoga server can infer it based of the schema.
7. Do the mutation resolver full CRUD exercise

   ```
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
   ```

### Database

The demo here is built around Prisma, which is a database-as-a-service. The Prisma server sits in front of the database, and alongside the prisma client (within the yoga server already built), resolves graphql queries against the actual database.

The article lists the potential pitfalls of using raw SQL queries or ORMs to resolve the graphql queries in your server. Strings become unruly and difficult to debug. ORMs are presented here as overly simple and unable to handle more complex GQL queries.

The Prisma client will take care of most simple resolvers automatically, just by reading the schema. The yoga server can implement custom logic alongside the Prisma resolvers.

