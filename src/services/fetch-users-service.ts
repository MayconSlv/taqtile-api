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
  items: number
}

export class FetchUsersService {
  async execute({ quantity, items }: FetchUsersServiceRequest): Promise<FetchUsersServiceResponse> {
    const repo = AppDataSource.getRepository(User)
    const users = await repo.find({
      order: {
        name: 'ASC',
      },
      take: quantity,
      skip: (items - 1) * quantity,
    })

    const totalUsers = await repo.count()

    const hasMoreAfter = items * quantity < totalUsers
    const hasMoreBefore = items > 1

    return {
      users,
      hasMoreAfter,
      hasMoreBefore,
      totalUsers,
    }
  }
}
