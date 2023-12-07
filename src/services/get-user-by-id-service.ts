import { AppDataSource } from '../data-source'
import { User } from '../entities/User'
import { ResourceNotFoundError } from './errros/resource-not-found-error'

interface GetUserServiceRequest {
  userId: string
}

interface GetUserServiceResponse {
  user: User
}

export class GetUserService {
  async execute({ userId }: GetUserServiceRequest): Promise<GetUserServiceResponse> {
    const repo = AppDataSource.getRepository(User)
    const user = await repo.findOne({
      where: { id: userId },
      relations: ['adresses'],
    })

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return {
      user,
    }
  }
}
