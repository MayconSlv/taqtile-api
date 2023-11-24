import { after, beforeEach, describe, it } from 'mocha'
import { AppDataSource } from '../../src/data-source'
import { User } from '../../src/entities/User'
import { makeApiCall } from '../../src/utils/make-api-call'
import { startServer } from '../../src/utils/start-server'
import { createApolloServer } from '../../src/lib/apollo'
import { ApolloServer } from 'apollo-server'
import { seedUsers } from '../../src/seeds/users.seed'
import { EmptyRequestData, IFetchUsersRequest, IFetchUsersResponse } from '../../src/models'
import { expect } from 'chai'
import { createAndAuthenticateUser } from '../../src/utils/create-and-authenticate-user'

describe('Fetch Many Users', () => {
  let token: string
  let server: ApolloServer
  const query = `query {
    users {
      users {
        name email id birthDate
      }
      hasMoreAfter
      hasMoreBefore
      totalUsers
    }
  }`
  const queryWithParams = `query ($data: UsersInput) {
    users (data: $data) {
      users {
        name email id birthDate
      }
      hasMoreAfter
      hasMoreBefore
      totalUsers
    }
  }`

  before(async () => {
    server = createApolloServer()
    await startServer(server)
  })

  beforeEach(async () => {
    const user = await createAndAuthenticateUser()
    token = user.token
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

  it('should be able to fetch users without params', async () => {
    const fetchResponse = await makeApiCall<EmptyRequestData, IFetchUsersResponse>({
      query,
      token,
    })

    const { data } = fetchResponse.data

    const usersInDatabase = await AppDataSource.getRepository(User).find()
    const usersFetchResponse = data.users.users

    usersFetchResponse.forEach((fetchUser) => {
      const dbUser = usersInDatabase.find((user) => user.id === fetchUser.id)!
      expect(fetchUser.name).that.is.a('string').to.equal(dbUser.name)
      expect(fetchUser.email).that.is.a('string').to.equal(dbUser.email)
      expect(fetchUser.id).that.is.a('string').to.equal(dbUser.id)
      expect(fetchUser.birthDate).that.is.a('string').to.equal(dbUser.birthDate)
    })
  })

  it('should be able to fetch users with params', async () => {
    const fetchResponse = await makeApiCall<IFetchUsersRequest, IFetchUsersResponse>({
      query: queryWithParams,
      token,
      dataInput: {
        quantity: 50,
        page: 2,
      },
    })

    const { data } = fetchResponse.data

    const usersInDatabase = await AppDataSource.getRepository(User).find()
    const usersFetchResponse = data.users.users

    usersFetchResponse.forEach((fetchUser) => {
      const dbUser = usersInDatabase.find((user) => user.id === fetchUser.id)!
      expect(fetchUser.name).that.is.a('string').to.equal(dbUser.name)
      expect(fetchUser.email).that.is.a('string').to.equal(dbUser.email)
      expect(fetchUser.id).that.is.a('string').to.equal(dbUser.id)
      expect(fetchUser.birthDate).that.is.a('string').to.equal(dbUser.birthDate)
    })
  })

  it('should not have a previous page', async () => {
    const fetchResponse = await makeApiCall<IFetchUsersRequest, IFetchUsersResponse>({
      query: queryWithParams,
      token,
      dataInput: {
        quantity: 40,
        page: 1,
      },
    })

    const { data } = fetchResponse.data

    expect(data.users).to.have.property('hasMoreBefore').that.is.equal(false)
    expect(data.users).to.have.property('hasMoreAfter').that.is.equal(true)
    expect(data.users).to.have.property('totalUsers').that.is.equal(40)
  })

  it('should have a previous page', async () => {
    const fetchResponse = await makeApiCall<IFetchUsersRequest, IFetchUsersResponse>({
      query: queryWithParams,
      token,
      dataInput: {
        quantity: 40,
        page: 3,
      },
    })

    const { data } = fetchResponse.data

    expect(data.users).to.have.property('hasMoreBefore').that.is.equal(true)
    expect(data.users).to.have.property('hasMoreAfter').that.is.equal(true)
    expect(data.users).to.have.property('totalUsers').that.is.equal(40)
  })

  it('should not have a next page', async () => {
    const fetchResponse = await makeApiCall<IFetchUsersRequest, IFetchUsersResponse>({
      query: queryWithParams,
      token,
      dataInput: {
        quantity: 40,
        page: 4,
      },
    })

    const { data } = fetchResponse.data

    expect(data.users).to.have.property('hasMoreBefore').that.is.equal(true)
    expect(data.users).to.have.property('hasMoreAfter').that.is.equal(false)
    expect(data.users).to.have.property('totalUsers').that.is.equal(40)
  })

  it('sould return users in alphabetical order', async () => {
    const fetchResponse = await makeApiCall<EmptyRequestData, IFetchUsersResponse>({
      query,
      token,
    })

    const { data } = fetchResponse.data

    const usersFetchResponse = data.users.users
    const usersInDatabase = await AppDataSource.getRepository(User).find({
      order: {
        name: 'ASC',
      },
    })

    const fetchUsersNames = usersFetchResponse.map((user) => user.name)
    const dbSortedUsersNames = usersInDatabase.map((user) => user.name).slice(0, 10)

    expect(dbSortedUsersNames).to.deep.equal(fetchUsersNames)
  })

  it('should not be able to fetch users with a invalid token', async () => {
    const fetchResponse = await makeApiCall<EmptyRequestData, IFetchUsersResponse>({
      query,
      token: 'invalid-token',
    })

    const { errors } = fetchResponse.data

    expect(errors[0]).to.have.property('message').that.is.equal('UNAUTHORIZED.')
  })
})
