import 'reflect-metadata'
import { ApolloServer } from 'apollo-server'
import { AppDataSource } from './data-source'
import { resolvers, typeDefs } from './graphql/index'

const server = new ApolloServer({
  resolvers,
  typeDefs,
  context: ({ req }) => {
    const token = req.headers.authorization

    return {
      token,
    }
  },
})

AppDataSource.initialize()
  .then(() => {
    console.log('Database OK.')
    server.listen().then(({ url }) => console.log(`Server is running on ${url}`))
  })
  .catch((err) => {
    console.log('Error:', err)
  })
