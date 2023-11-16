import { GraphQLError } from 'graphql'
import { User } from './entities/User'

interface LoginResponseData {
  login: {
    token: string
    user: User
  }
}

export interface ILoginResponse {
  data: LoginResponseData
  errors: GraphQLError[]
}

export interface ILoginRequest {
  email: string
  password: string
  rememberMe: boolean
}

interface CreateUserData {
  createUser: {
    user: User
  }
}
export interface ICreateUserRequest {
  name: string
  email: string
  birthDate: string
  password: string
}
export interface ICreateUserResponse {
  data: CreateUserData
  errors: GraphQLError[]
}

interface GetUserData {
  user: User
}

export interface IGetUserRequest {
  userId: string
}

export interface IGetUserResposne {
  data: GetUserData
  errors: GraphQLError[]
}
