import { z } from 'zod'
import { User } from '../../entities/User'
import { CreateUserService } from '../../services/create-user-service'
import { AuthenticateService } from '../../services/authenticate-service'
import { verifyToken } from '../../middleware/verify-token'

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
    hello: (_, data, { isAuthenticated }) => {
      console.log(isAuthenticated())
      return 'Hello Taqtile'
    },
  },
}
