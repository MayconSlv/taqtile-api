import { z } from 'zod'
import { User } from '../../entities/User'
import { CreateUserService } from '../../services/create-user-service'
import { AuthenticateService } from '../../services/authenticate-service'
import { verifyToken } from '../../middleware/verify-token'
import { GetUserService } from '../../services/get-user-by-id-service'
import { FetchUsersService } from '../../services/fetch-users-service'

interface UserInputData {
  data: User
}

interface LoginInputData {
  data: {
    email: string
    password: string
    rememberMe: boolean
  }
}

interface GetUserData {
  data: {
    userId: string
  }
}

interface FetchUsersData {
  data: {
    quantity: number
    skiped_users: number
  }
}

export = {
  Mutation: {
    createUser: async (_, { data }: UserInputData, { token }) => {
      verifyToken(token)

      const userInputDataSchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z
          .string()
          .min(6, { message: 'The password must contain 6 characters.' })
          .refine(
            (password) => {
              return /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)
            },
            {
              message: 'The password must contain 1 letter and 1 digit.',
            },
          ),
        birthDate: z.string(),
      })

      const { name, email, password, birthDate } = userInputDataSchema.parse(data)

      const createUser = new CreateUserService()
      const { user } = await createUser.execute({ name, email, password, birthDate })

      return user
    },
    login: async (_, { data }: LoginInputData) => {
      const loginInputDataSchema = z.object({
        email: z.string().email(),
        password: z.string(),
        rememberMe: z.boolean().default(false),
      })

      const { email, password, rememberMe } = loginInputDataSchema.parse(data)

      const authenticateUser = new AuthenticateService()
      const { user, token } = await authenticateUser.execute({ email, password, rememberMe })

      return {
        user,
        token,
      }
    },
  },
  Query: {
    user: async (_, { data }: GetUserData, { token }) => {
      verifyToken(token)

      const getUserDataSchema = z.object({
        userId: z.string().uuid(),
      })

      const { userId } = getUserDataSchema.parse(data)

      const getUser = new GetUserService()
      const { user } = await getUser.execute({ userId })

      return user
    },
    users: async (_, { data }: FetchUsersData, { token }) => {
      verifyToken(token)

      const fetchUsersDataSchema = z.object({
        quantity: z.number(),
        skiped_users: z.number(),
      })

      const { quantity, skiped_users } = fetchUsersDataSchema.parse(data)

      const fetchUsers = new FetchUsersService()
      const { users, hasMoreAfter, hasMoreBefore, totalUsers } = await fetchUsers.execute({ quantity, skiped_users })

      return {
        users,
        totalUsers,
        hasMoreAfter,
        hasMoreBefore,
      }
    },
  },
}
