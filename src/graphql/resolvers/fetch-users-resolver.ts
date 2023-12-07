import { Arg, Ctx, Query, Resolver } from 'type-graphql'
import { MUser } from '../../dtos/models/user-model'
import { GetUserByIdInput } from '../../dtos/inputs/get-user-by-id-input'
import { GetUserService } from '../../services/get-user-by-id-service'
import { FetchUsersInput } from '../../dtos/inputs/fetch-users-input'
import { FetchUsersService } from '../../services/fetch-users-service'
import { FetchUsersResponse } from '../../dtos/models/fetch-users-response'
import { MyContext } from '../../models'
import { verifyToken } from '../../middleware/verify-token'

@Resolver()
export class FetchUsersResolver {
  @Query(() => MUser)
  async user(@Arg('data') { userId }: GetUserByIdInput, @Ctx() { token }: MyContext) {
    verifyToken(token)

    const getUser = new GetUserService()
    const { user } = await getUser.execute({ userId })

    return user
  }

  @Query(() => FetchUsersResponse)
  async users(@Arg('data') { quantity, skipedUsers }: FetchUsersInput, @Ctx() { token }: MyContext) {
    verifyToken(token)

    const fetchUsers = new FetchUsersService()
    const { users, totalUsers, hasMoreAfter, hasMoreBefore } = await fetchUsers.execute({
      quantity,
      skipedUsers,
    })

    return {
      users,
      totalUsers,
      hasMoreAfter,
      hasMoreBefore,
    }
  }
}
