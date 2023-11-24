import { gql } from 'apollo-server'

export = gql`
  input UsersInput {
    quantity: Int!
    items: Int!
  }

  type UsersResponse {
    users: [User!]!
    totalUsers: Int!
    hasMoreBefore: Boolean!
    hasMoreAfter: Boolean!
  }

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

  input GetUserInput {
    userId: String!
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
    user(data: GetUserInput): User!
    users(data: UsersInput = { quantity: 10, items: 1 }): UsersResponse!
  }
`
