import { Prisma } from 'prisma-binding'
import { GraphQLServer } from 'graphql-yoga'
import resolvers from './resolvers'

const prisma = new Prisma({
  typeDefs: 'prisma/prisma.graphql',
  endpoint: "http://localhost:4466/todo-blogger"
})

const server = new GraphQLServer({
  typeDefs: 'src/schema.graphql',
  context: { prisma },
  resolvers,
})

server.start( { port: 4100 }, ({ port }) => console.log(`Server is running on localhost:${port}`));