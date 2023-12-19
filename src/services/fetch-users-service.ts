import { Service } from 'typedi'
import { User } from '../entities/User'
import { UserRepository } from '../repository/typeorm-user-repository'

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

@Service()
export class FetchUsersService {
  constructor(private userRepository: UserRepository) {}

  async execute({ quantity, skipedUsers }: FetchUsersServiceRequest): Promise<FetchUsersServiceResponse> {
    const users = await this.userRepository.fetchAll(quantity, skipedUsers)

    const totalUsers = await this.userRepository.countAll()

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
