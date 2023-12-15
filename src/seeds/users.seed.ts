import {
  randCity,
  randCompanyName,
  randEmail,
  randFullName,
  randNumber,
  randPassword,
  randStreetName,
  randUuid,
} from '@ngneat/falso'
import { AppDataSource } from '../data-source'
import { User } from '../entities/User'
import { Address } from '../entities/Address'
import { hash } from 'bcryptjs'

export async function seedUsers() {
  const userRepository = AppDataSource.getRepository(User)
  const addressRepository = AppDataSource.getRepository(Address)

  const usersToInsert: User[] = await Promise.all(
    Array.from({ length: 50 }, async () => ({
      id: randUuid(),
      name: randFullName(),
      email: randEmail(),
      passwordHash: await hash(randPassword(), 6),
      birthDate: '12-12-90',
      addresses: [],
    })),
  )

  const addressToInsert: Address[] = await Promise.all(
    usersToInsert.map((user) => ({
      cep: '12345-678',
      city: randCity(),
      complement: 'Apto 123',
      id: randUuid(),
      neighborhood: randCompanyName(),
      state: 'state',
      street: randStreetName(),
      streetNumber: randNumber({ length: 3 }).toString(),
      user,
    })),
  )

  await userRepository.save(usersToInsert)
  await addressRepository.save(addressToInsert)
}
