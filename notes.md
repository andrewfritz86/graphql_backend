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

### Steps

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
