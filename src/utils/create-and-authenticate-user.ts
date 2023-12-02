import { hash } from 'bcryptjs'
import { AppDataSource } from '../data-source'
import { User } from '../entities/User'
import { sign } from 'jsonwebtoken'
import { Address } from '../entities/Address'

export async function createAndAuthenticateUser() {
  const passwordHash = await hash('123456a', 6)

  const userRepository = AppDataSource.getRepository(User)
  const addressRepository = AppDataSource.getRepository(Address)

  const user = await userRepository.save({
    name: 'John Doe',
    email: 'johndoe@email.com',
    birthDate: '12-12-1990',
    passwordHash,
  })

  await addressRepository.save({
    cep: '12345-678',
    city: 'Javascript City',
    complement: 'Typecript',
    neighborhood: 'Java',
    state: 'JS',
    street: 'Javascript Street',
    streetNumber: '123',
    user,
  })

  const token = sign({ sub: user.id }, String(process.env.JWT_SECRET), { expiresIn: '1h' })

  return {
    token,
  }
}
