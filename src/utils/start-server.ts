import { ApolloServer } from 'apollo-server'
import { AppDataSource } from '../data-source'

export async function startServer(server: ApolloServer) {
  return AppDataSource.initialize()
    .then(() => {
      console.log(`${process.env.DB_DATABASE} ok`)
      server.listen()
    })
    .catch((err) => {
      console.log(err)
    })
}
