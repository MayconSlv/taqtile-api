import { after, beforeEach, describe, it } from 'mocha'
import { AppDataSource } from '../../src/data-source'
import { User } from '../../src/entities/User'
import { makeApiCall } from '../../src/utils/make-api-call'
import { startServer } from '../../src/utils/start-server'
import { createApolloServer } from '../../src/lib/apollo'
import { ApolloServer } from 'apollo-server'
import { seedUsers } from '../../src/seeds/users.seed'
import { EmptyRequestData, IFetchUsersResponse } from '../../src/models'
import { expect } from 'chai'

describe('Fetch Many Users', () => {
  let server: ApolloServer
  const query = `query{
    users {
      name email birthDate id
    }
  }`

  before(async () => {
    server = createApolloServer()
    await startServer(server)
  })

  beforeEach(async () => {
    await seedUsers()
  })

  afterEach(async () => {
    const userRepository = AppDataSource.getRepository(User)
    await userRepository.clear()
  })

  after(async () => {
    await AppDataSource.destroy()
    await server.stop()
  })

  it('should be able to fetch many users', async () => {
    const fetchResponse = await makeApiCall<EmptyRequestData, IFetchUsersResponse>({
      query,
    })

    const { data } = fetchResponse.data

    const usersInDatabase = await AppDataSource.getRepository(User).find()
    const usersFetchResponse = data.users

    usersFetchResponse.forEach((fetchUser) => {
      const dbUser = usersInDatabase.find((user) => user.id === fetchUser.id)!
      expect(fetchUser.name).that.is.a('string').to.equal(dbUser.name)
      expect(fetchUser.email).that.is.a('string').to.equal(dbUser.email)
      expect(fetchUser.id).that.is.a('string').to.equal(dbUser.id)
      expect(fetchUser.birthDate).that.is.a('string').to.equal(dbUser.birthDate)
    })
  })
})
