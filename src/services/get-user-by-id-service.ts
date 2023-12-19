import { Service } from 'typedi'
import { User } from '../entities/User'
import { ResourceNotFoundError } from './errros/resource-not-found-error'
import { UserRepository } from '../repository/typeorm-user-repository'

interface GetUserServiceRequest {
  userId: string
}

interface GetUserServiceResponse {
  user: User
}

@Service()
export class GetUserService {
  constructor(private userRepository: UserRepository) {}

  async execute({ userId }: GetUserServiceRequest): Promise<GetUserServiceResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return {
      user,
    }
  }
}
