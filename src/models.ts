import { GraphQLError } from 'graphql'
import { User } from './entities/User'

interface BaseResponseData<T> {
  data: T
  errors: GraphQLError[]
}

// Login REQUEST and RESPONSE data
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

// Create User REQUEST and RESPONSE data
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

// Get a Specific User REQUEST and RESPONSE data
interface GetUserData {
  user: User
}
export interface IGetUserRequest {
  userId: string
}
export interface IGetUserResposne extends BaseResponseData<GetUserData> {}
