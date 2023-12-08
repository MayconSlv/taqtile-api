import { Arg, Ctx, Mutation } from 'type-graphql'
import { CreateUserInput } from '../../dtos/inputs/create-user-input'
import { CreateUserService } from '../../services/create-user-service'
import { User } from '../../dtos/models/user-model'
import { MyContext } from '../../models'
import { verifyToken } from '../../middleware/verify-token'

export class CreateUserResolver {
  @Mutation(() => User)
  async createUser(@Arg('data') { birthDate, name, email, password }: CreateUserInput, @Ctx() { token }: MyContext) {
    verifyToken(token)

    const createUser = new CreateUserService()
    return createUser.execute({ name, email, birthDate, password })
  }
}
