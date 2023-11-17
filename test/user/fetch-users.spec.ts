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

let server: ApolloServer
const query = `query{
  users {
    name email birthDate id
  }
}`

describe.only('Fetch Many Users', () => {
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
    expect(data).to.have.property('users').that.is.an('array')
    expect(data.users).to.have.lengthOf(50)
    expect(data.users[0]).to.have.property('name').that.is.a('string')
    expect(data.users[0]).to.have.property('email').that.is.a('string')
    expect(data.users[0]).to.have.property('birthDate').that.is.a('string')
    expect(data.users[0]).to.have.property('id').that.is.a('string')
  })
})
