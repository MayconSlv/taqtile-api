import { AppDataSource } from '../data-source'
import { User } from '../entities/User'
import { ResourceNotFoundError } from './errros/resource-not-found-error'

interface FetchUsersServiceResponse {
  users: User[]
  totalUsers: number
  hasMoreAfter: boolean
  hasMoreBefore: boolean
}

interface FetchUsersServiceRequest {
  quantity: number
  page: number
}

export class FetchUsersService {
  async execute({ quantity, page }: FetchUsersServiceRequest): Promise<FetchUsersServiceResponse> {
    const repo = AppDataSource.getRepository(User)
    const databaseUsers = await repo.find({
      order: {
        name: 'ASC',
      },
      take: quantity,
    })

    const users = databaseUsers.slice((page - 1) * 10, page * 10)
    const totalUsers = databaseUsers.length

    const hasMoreAfter = page * 10 < totalUsers
    const hasMoreBefore = page > 1

    if (users.length === 0) {
      throw new ResourceNotFoundError()
    }

    return {
      users,
      hasMoreAfter,
      hasMoreBefore,
      totalUsers,
    }
  }
}
