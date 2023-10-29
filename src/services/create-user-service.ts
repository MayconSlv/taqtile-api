import { AppDataSource } from '../data-source'
import { User } from '../entities/User'
import { hash } from 'bcryptjs'

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

    const passwordHash = await hash(password, 6)

    const user = repo.create({ name, email, passwordHash, birthDate })
    await repo.save(user)

    return {
      user,
    }
  }
}