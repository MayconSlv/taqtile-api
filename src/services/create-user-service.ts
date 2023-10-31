import { AppDataSource } from '../data-source'
import { User } from '../entities/User'

interface CreateUserServiceRequest {
  name: string
  email: string
  password: string
  birthDate: string
}

interface CreateUserServiceResponse {
  user: User
}

export class CreateUserService {
  async execute({ name, email, password, birthDate }: CreateUserServiceRequest): Promise<CreateUserServiceResponse> {
    const repo = AppDataSource.getRepository(User)

    const userWithSameEmail = await repo.findOne({ where: { email } })
    if (userWithSameEmail) {
      throw new Error('Email address already exists')
    }

    const user = repo.create({ name, email, password, birthDate })
    await repo.save(user)

    return {
      user,
    }
  }
}
