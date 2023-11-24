import { GraphQLError } from 'graphql'
import { User } from './entities/User'

interface BaseResponseData<T> {
  data: T
  errors: GraphQLError[]
}

interface LoginResponseData {
  login: {
    token: string
    user: User
  }
}
export interface ILoginRequest {
  email: string
  password: string
  rememberMe: boolean
}
export interface ILoginResponse extends BaseResponseData<LoginResponseData> {}

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
export interface ICreateUserResponse extends BaseResponseData<CreateUserData> {}

interface GetUserData {
  user: User
}
export interface IGetUserRequest {
  userId: string
}
export interface IGetUserResposne extends BaseResponseData<GetUserData> {}

interface FetchUsersData {
  users: {
    users: User[]
    hasMoreAfter: boolean
    hasMoreBefore: boolean
    totalUsers: number
  }
}
export interface IFetchUsersResponse extends BaseResponseData<FetchUsersData> {}
export interface IFetchUsersRequest {
  quantity: number
  page: number
}

export interface EmptyRequestData {}
