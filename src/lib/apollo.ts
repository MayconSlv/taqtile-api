import { ApolloServer } from 'apollo-server'
import { buildSchema } from 'type-graphql'
import { AuthenticateResolver } from '../graphql/resolvers/authenticate'
import { CreateUserResolver } from '../graphql/resolvers/crate-user'
import { FetchUsersResolver } from '../graphql/resolvers/fetch-users-resolver'
import { Container } from 'typedi'

export const createApolloServer = async () => {
  const schema = await buildSchema({
    resolvers: [AuthenticateResolver, CreateUserResolver, FetchUsersResolver],
    container: Container,
  })

  return new ApolloServer({
    schema,
    context: ({ req }) => {
      const token = req.headers.authorization
      return {
        token,
      }
    },
  })
}
