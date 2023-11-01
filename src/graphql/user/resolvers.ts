import { z } from 'zod'
import { User } from '../../entities/User'
import { CreateUserService } from '../../services/create-user-service'

interface UserInputData {
  data: User
}

export = {
  Mutation: {
    createUser: async (_, { data }: UserInputData) => {
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
  },
  Query: {
    hello: () => {
      return 'Hello Taqtile'
    },
  },
}
