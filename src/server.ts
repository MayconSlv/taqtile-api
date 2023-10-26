import { ApolloServer, gql } from 'apollo-server'

const typeDefs = gql`
  type Query {
    hello: String!
  }
`

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query: {
      hello: () => {
        return 'Hello, world!'
      }
    }
  },
})

server.listen().then(({ url }) => console.log(`Server is running on ${url}`))
