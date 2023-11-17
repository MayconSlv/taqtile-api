import { randEmail, randFullName, randPassword, randUuid } from '@ngneat/falso'
import { AppDataSource } from '../data-source'
import { User } from '../entities/User'
import { hash } from 'bcryptjs'

export async function seedUsers() {
  const userRepository = AppDataSource.getRepository(User)
  const usersToInsert: User[] = []

  for (let i = 0; i < 50; i++) {
    usersToInsert.push({
      id: randUuid(),
      name: randFullName(),
      email: randEmail(),
      passwordHash: await hash(randPassword(), 6),
      birthDate: '12-12-1990',
    })
  }

  await userRepository.save(usersToInsert)
}
