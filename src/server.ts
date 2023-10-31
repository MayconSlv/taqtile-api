import 'reflect-metadata'
import { ApolloServer, gql } from 'apollo-server'
import { AppDataSource } from './data-source'
import { User } from './entities/User'

const typeDefs = gql`
  input UserInput {
    name: String!
    email: String!
    password: String!
    birthDate: String!
  }

  type User {
    id: ID!
    name: String
    email: String
    birthDate: String
  }

  type Query {
    users: [User]
  }

  type Mutation {
    createUser(data: UserInput): User!
  }
`

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query: {
      async users() {
        const repo = AppDataSource.getRepository(User)
        const users = await repo.find()

        return users
      },
    },
    Mutation: {
      createUser: (_, { data }) => {
        const { name, email, birthDate, password } = data

        const user = {
          name,
          email,
          birthDate,
          password,
        }

        return user
      },
    },
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
