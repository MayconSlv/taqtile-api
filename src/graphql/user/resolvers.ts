import { User } from '../../entities/User'
import { CreateUserService } from '../../services/create-user-service'

interface UserInputData {
  data: User
}

export = {
  Mutation: {
    createUser: async (_, { data }: UserInputData) => {
      const { name, email, birthDate, password } = data

      const createUser = new CreateUserService()

      const { user } = await createUser.execute({ name, email, password, birthDate })

      return user
    },
  },
}
