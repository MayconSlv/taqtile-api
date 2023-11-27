import { AppDataSource } from '../data-source'
import { User } from '../entities/User'

interface FetchUsersServiceResponse {
  users: User[]
  totalUsers: number
  hasMoreAfter: boolean
  hasMoreBefore: boolean
}

interface FetchUsersServiceRequest {
  quantity: number
  skiped_users: number
}

export class FetchUsersService {
  async execute({ quantity, skiped_users }: FetchUsersServiceRequest): Promise<FetchUsersServiceResponse> {
    const repo = AppDataSource.getRepository(User)
    const users = await repo.find({
      order: {
        name: 'ASC',
      },
      take: quantity,
      skip: skiped_users,
    })

    const totalUsers = await repo.count()

    const hasMoreAfter = skiped_users + quantity < totalUsers
    const hasMoreBefore = skiped_users > 1

    return {
      users,
      hasMoreAfter,
      hasMoreBefore,
      totalUsers,
    }
  }
}
