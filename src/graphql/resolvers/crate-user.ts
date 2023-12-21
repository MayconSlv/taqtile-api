import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { CreateUserInput } from '../../dtos/inputs/create-user-input'
import { CreateUserService } from '../../services/create-user-service'
import { User } from '../../dtos/models/user-model'
import { MyContext } from '../../models'
import { verifyToken } from '../../middleware/verify-token'
import { Service } from 'typedi'

@Service()
@Resolver()
export class CreateUserResolver {
  constructor(private createUserService: CreateUserService) {}

  @Mutation(() => User)
  async createUser(@Arg('data') { birthDate, name, email, password }: CreateUserInput, @Ctx() { token }: MyContext) {
    verifyToken(token)
    const { user } = await this.createUserService.execute({ name, email, birthDate, password })
    return user
  }
}
