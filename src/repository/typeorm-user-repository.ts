import { Service } from 'typedi'
import { AppDataSource } from '../data-source'
import { User } from '../entities/User'

interface CreateUserData {
  name: string
  email: string
  passwordHash: string
  birthDate: string
}

@Service()
export class UserRepository {
  async findByEmail(email: string) {
    const user = await AppDataSource.getRepository(User).findOne({
      where: {
        email,
      },
    })

    return user
  }

  async findById(id: string) {
    const user = await AppDataSource.getRepository(User).findOne({
      where: {
        id,
      },
      relations: ['addresses'],
    })

    return user
  }

  async create(data: CreateUserData) {
    const user = await AppDataSource.getRepository(User).save(data)

    return user
  }

  async fetchAll(quantity: number, skipedUsers: number) {
    const users = await AppDataSource.getRepository(User).find({
      order: {
        name: 'ASC',
      },
      skip: skipedUsers,
      take: quantity,
      relations: ['addresses'],
    })

    return users
  }

  async countAll() {
    const totalUsers = await AppDataSource.getRepository(User).count()
    return totalUsers
  }
}
