import { hash } from 'bcryptjs'
import { AppDataSource } from '../data-source'
import { User } from '../entities/User'
import { sign } from 'jsonwebtoken'

export async function createAndAuthenticateUser() {
  const passwordHash = await hash('123456a', 6)
  const repo = AppDataSource.getRepository(User)

  const user = await repo.save({
    name: 'John Doe',
    email: 'johndoe@email.com',
    birthDate: '12-12-1990',
    passwordHash,
  })

  const token = sign({ sub: user.id }, String(process.env.JWT_SECRET), { expiresIn: '1h' })

  return {
    token,
  }
}
