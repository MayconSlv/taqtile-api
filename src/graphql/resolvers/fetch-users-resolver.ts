import { Arg, Ctx, Query, Resolver } from 'type-graphql'
import { User } from '../../dtos/models/user-model'
import { GetUserByIdInput } from '../../dtos/inputs/get-user-by-id-input'
import { GetUserService } from '../../services/get-user-by-id-service'
import { FetchUsersInput } from '../../dtos/inputs/fetch-users-input'
import { FetchUsersService } from '../../services/fetch-users-service'
import { FetchUsersResponse } from '../../dtos/models/fetch-users-response'
import { MyContext } from '../../models'
import { verifyToken } from '../../middleware/verify-token'

@Resolver()
export class FetchUsersResolver {
  @Query(() => User)
  async user(@Arg('data') { userId }: GetUserByIdInput, @Ctx() { token }: MyContext) {
    verifyToken(token)

    const getUser = new GetUserService()
    return getUser.execute({ userId })
  }

  @Query(() => FetchUsersResponse)
  async users(@Arg('data') { quantity, skipedUsers }: FetchUsersInput, @Ctx() { token }: MyContext) {
    verifyToken(token)

    const fetchUsers = new FetchUsersService()
    return fetchUsers.execute({ quantity, skipedUsers })
  }
}
