import { AppDataSource } from '../data-source'
import { User } from '../entities/User'
import { ResourceNotFoundError } from './errros/resource-not-found-error'

interface FetchUsersServiceResponse {
  users: User[]
}

export class FetchUsersService {
  async execute(): Promise<FetchUsersServiceResponse> {
    const repo = AppDataSource.getRepository(User)
    const users = await repo.find()

    if (!users) {
      throw new ResourceNotFoundError()
    }

    return {
      users,
    }
  }
}
