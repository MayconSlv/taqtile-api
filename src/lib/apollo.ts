import { ApolloServer } from 'apollo-server'
import { resolvers, typeDefs } from '../graphql'

export const createApolloServer = () => {
  return new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization
      return {
        token,
      }
    },
  })
}
