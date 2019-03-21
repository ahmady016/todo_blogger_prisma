import { Prisma } from 'prisma-binding'
import { GraphQLServer } from 'graphql-yoga'

const prisma = new Prisma({
  typeDefs: 'prisma/prisma.graphql',
  endpoint: "http://localhost:4466/todo-blogger"
})

const typeDefs = `
  type Query {
    hello(name: String): String!
  }
`

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
  },
}

const server = new GraphQLServer({ typeDefs, resolvers })
server.start( { port: 4100 }, ({ port }) => console.log(`Server is running on localhost:${port}`));