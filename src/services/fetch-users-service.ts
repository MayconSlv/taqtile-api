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
  skipedUsers: number
}

export class FetchUsersService {
  async execute({ quantity, skipedUsers }: FetchUsersServiceRequest): Promise<FetchUsersServiceResponse> {
    const repo = AppDataSource.getRepository(User)
    const users = await repo.find({
      order: {
        name: 'ASC',
      },
      take: quantity,
      skip: skipedUsers,
      relations: ['address'],
    })

    const totalUsers = await repo.count()

    const hasMoreAfter = skipedUsers + quantity < totalUsers
    const hasMoreBefore = skipedUsers > 1

    return {
      users,
      hasMoreAfter,
      hasMoreBefore,
      totalUsers,
    }
  }
}
