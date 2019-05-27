import { Prisma } from 'prisma-binding'
import { GraphQLServer } from 'graphql-yoga'
import resolvers from './resolvers'

const db = new Prisma({
  typeDefs: 'prisma/prisma.graphql',
  endpoint: 'http://localhost:4466/todo-blogger'
})

const server = new GraphQLServer({
  typeDefs: 'src/schema.graphql',
  context: { db },
  resolvers
})

const port = process.env.PORT || 4100
server.start({ port }, ({ port }) =>
  console.log(`Server is running on http://localhost:${port}`)
)
