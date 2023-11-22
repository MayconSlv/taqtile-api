import { AppDataSource } from '../data-source'
import { User } from '../entities/User'
import { ResourceNotFoundError } from './errros/resource-not-found-error'

interface FetchUsersServiceResponse {
  users: User[]
}

interface FetchUsersServiceRequest {
  quantity: number
}

export class FetchUsersService {
  async execute({ quantity }: FetchUsersServiceRequest): Promise<FetchUsersServiceResponse> {
    const repo = AppDataSource.getRepository(User)
    const users = await repo.find({
      order: {
        name: 'ASC',
      },
      take: quantity,
    })

    if (!users) {
      throw new ResourceNotFoundError()
    }

    return {
      users,
    }
  }
}
