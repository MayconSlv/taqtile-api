import { Arg, Ctx, Mutation } from 'type-graphql'
import { CreateUserInput } from '../../dtos/inputs/create-user-input'
import { CreateUserService } from '../../services/create-user-service'
import { MUser } from '../../dtos/models/user-model'
import { z } from 'zod'
import { MyContext } from '../../models'
import { verifyToken } from '../../middleware/verify-token'

export class CreateUserResolver {
  @Mutation(() => MUser)
  async createUser(@Arg('data') { birthDate, name, ...data }: CreateUserInput, @Ctx() { token }: MyContext) {
    verifyToken(token)

    const userInputDataSchema = z.object({
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
    })
    const { password, email } = userInputDataSchema.parse(data)

    const createUser = new CreateUserService()
    const { user } = await createUser.execute({ name, email, birthDate, password })

    return user
  }
}
