import { AppDataSource } from '../data-source'
import { User } from '../entities/User'
import { compare } from 'bcryptjs'
import { InvalidCredentialsError } from './errros/invalid-credentials-error'
import jwt from 'jsonwebtoken'

interface AuthenticateRequest {
  email: string
  password: string
  rememberMe: boolean
}

interface AuthenticateResponse {
  user: User
  token: string
}

export class AuthenticateService {
  async execute({ email, password, rememberMe }: AuthenticateRequest): Promise<AuthenticateResponse> {
    const repo = AppDataSource.getRepository(User)

    const user = await repo.findOne({ where: { email } })
    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatches = await compare(password, user.passwordHash)
    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    const token = jwt.sign({ sub: user.id }, String(process.env.JWT_SECRET), { expiresIn: rememberMe ? '7d' : '1h' })

    return {
      user,
      token,
    }
  }
}
