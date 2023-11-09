import { AppDataSource } from '../data-source'
import { User } from '../entities/User'
import { compare } from 'bcryptjs'
import { InvalidCredentialsError } from './errros/invalid-credentials-error'

interface AuthenticateRequest {
  email: string
  password: string
}

interface AuthenticateResponse {
  user: User
}

export class AuthenticateService {
  async execute({ email, password }: AuthenticateRequest): Promise<AuthenticateResponse> {
    const repo = AppDataSource.getRepository(User)

    const user = await repo.findOne({ where: { email } })
    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatches = await compare(password, user.passwordHash)
    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    return {
      user,
    }
  }
}
