import { Arg, Ctx, Query, Resolver } from 'type-graphql'
import { User } from '../../dtos/models/user-model'
import { GetUserByIdInput } from '../../dtos/inputs/get-user-by-id-input'
import { GetUserService } from '../../services/get-user-by-id-service'
import { FetchUsersInput } from '../../dtos/inputs/fetch-users-input'
import { FetchUsersService } from '../../services/fetch-users-service'
import { FetchUsersResponse } from '../../dtos/models/fetch-users-response'
import { MyContext } from '../../models'
import { verifyToken } from '../../middleware/verify-token'
import { Service } from 'typedi'

@Service()
@Resolver()
export class FetchUsersResolver {
  constructor(
    private getUserService: GetUserService,
    private fetchUsersService: FetchUsersService,
  ) {}

  @Query(() => User)
  async user(@Arg('data') { userId }: GetUserByIdInput, @Ctx() { token }: MyContext) {
    verifyToken(token)

    const { user } = await this.getUserService.execute({ userId })
    return user
  }

  @Query(() => FetchUsersResponse)
  async users(
    @Arg('data', { nullable: true, defaultValue: { quantity: 10, skipedUsers: 0 } })
    { quantity, skipedUsers }: FetchUsersInput,
    @Ctx() { token }: MyContext,
  ) {
    verifyToken(token)
    return this.fetchUsersService.execute({ quantity, skipedUsers })
  }
}
