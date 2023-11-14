import { gql } from 'apollo-server'

export = gql`
  input UserInput {
    name: String!
    email: String!
    password: String!
    birthDate: String!
  }

  input LoginInput {
    email: String!
    password: String!
    rememberMe: Boolean!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    birthDate: String!
  }

  type LoginResponse {
    user: User!
    token: String!
  }

  type Mutation {
    createUser(data: UserInput): User!
    login(data: LoginInput): LoginResponse!
  }

  type Query {
    hello: String
  }
`
