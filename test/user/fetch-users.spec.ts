import { after, beforeEach, describe, it } from 'mocha'
import { AppDataSource } from '../../src/data-source'
import { User } from '../../src/entities/User'
import { makeApiCall } from '../../src/utils/make-api-call'
import { startServer } from '../../src/utils/start-server'
import { createApolloServer } from '../../src/lib/apollo'
import { ApolloServer } from 'apollo-server'
import { seedUsers } from '../../src/seeds/users.seed'

let server: ApolloServer
const query = `query{
  users {
    name email birthDate id
  }
}`

describe('Fetch Many Users', () => {
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
    const fetchResponse = await makeApiCall({
      query,
    })

    console.log(fetchResponse.data)
  })
})
