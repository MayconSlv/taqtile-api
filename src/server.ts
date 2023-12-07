import 'reflect-metadata'
import path from 'node:path'

import { ApolloServer } from 'apollo-server'
import { AppDataSource } from './data-source'
import { buildSchema } from 'type-graphql'

import { AuthenticateResolver } from './graphql/resolvers/authenticate'
import { CreateUserResolver } from './graphql/resolvers/crate-user'
import { FetchUsersResolver } from './graphql/resolvers/fetch-users-resolver'

async function server() {
  const schema = await buildSchema({
    resolvers: [AuthenticateResolver, CreateUserResolver, FetchUsersResolver],
    emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
  })

  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      const token = req.headers.authorization

      return {
        token,
      }
    },
  })
  AppDataSource.initialize()
  await server.listen().then(({ url }) => console.log(`Server is running on ${url}`))
}
server()
