import { User } from '../entities/User'
import { hash } from 'bcryptjs'
import { UserWithSameEmailError } from './errros/user-with-same-email-error'
import { Service } from 'typedi'
import { UserRepository } from '../repository/typeorm-user-repository'

interface CreateUserServiceRequest {
  name: string
  email: string
  password: string
  birthDate: string
}

interface CreateUserServiceResponse {
  user: User
}

@Service()
export class CreateUserService {
  constructor(private userRepository: UserRepository) {}

  async execute({ name, email, password, birthDate }: CreateUserServiceRequest): Promise<CreateUserServiceResponse> {
    const userWithSameEmail = await this.userRepository.findByEmail(email)
    if (userWithSameEmail) {
      throw new UserWithSameEmailError()
    }

    const passwordHash = await hash(password, 6)

    const user = await this.userRepository.create({ name, email, passwordHash, birthDate })

    return {
      user,
    }
  }
}
