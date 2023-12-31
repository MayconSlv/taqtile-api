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
import { removeDataFromDatabase } from '../../src/utils/remove-data-from-db'

describe('Fetch Many Users', () => {
  let token: string
  let server: ApolloServer
  const query = `query ($data: FetchUsersInput){
    users (data: $data) {
      users {
        name
        email
        id
        birthDate
        addresses {
          id
          city
          cep
          complement
          state
          street
          streetNumber
          neighborhood
        }
      }
      hasMoreAfter
      hasMoreBefore
      totalUsers
    }
  }`

  before(async () => {
    server = await createApolloServer()
    await startServer(server)
  })

  beforeEach(async () => {
    const user = await createAndAuthenticateUser()
    token = user.token
    await seedUsers()
  })

  afterEach(async () => {
    const userRepository = AppDataSource.getRepository(User)
    await removeDataFromDatabase<User>(userRepository)
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

    const usersInDatabase = await AppDataSource.getRepository(User).find({
      order: {
        name: 'ASC',
      },
      relations: ['addresses'],
    })
    const usersFetchResponse = data.users.users

    usersFetchResponse.forEach((fetchUser, index) => {
      const dbUser = usersInDatabase.find((user) => user.id === fetchUser.id)!

      expect(fetchUser.name).that.is.a('string').to.equal(dbUser.name)
      expect(fetchUser.email).that.is.a('string').to.equal(dbUser.email)
      expect(fetchUser.id).that.is.a('string').to.equal(dbUser.id)
      expect(fetchUser.birthDate).that.is.a('string').to.equal(dbUser.birthDate)
      expect(usersInDatabase.indexOf(dbUser)).to.equal(index)

      const fetchUserAddress = fetchUser.addresses[0]
      const dbUserAddress = dbUser.addresses[0]

      expect(fetchUserAddress.id).to.be.a('string').to.equal(dbUserAddress.id)
      expect(fetchUserAddress.cep).to.be.a('string').to.equal(dbUserAddress.cep)
      expect(fetchUserAddress.city).to.be.a('string').to.equal(dbUserAddress.city)
      expect(fetchUserAddress.complement).to.be.a('string').to.equal(dbUserAddress.complement)
      expect(fetchUserAddress.neighborhood).to.be.a('string').to.equal(dbUserAddress.neighborhood)
      expect(fetchUserAddress.state).to.be.a('string').to.equal(dbUserAddress.state)
      expect(fetchUserAddress.street).to.be.a('string').to.equal(dbUserAddress.street)
      expect(fetchUserAddress.streetNumber).to.be.a('string').to.equal(dbUserAddress.streetNumber)
    })
    expect(usersFetchResponse).to.have.length(10)
  })

  it('should be able to fetch users with params', async () => {
    const skipedUsers = 10
    const fetchResponse = await makeApiCall<IFetchUsersRequest, IFetchUsersResponse>({
      query,
      token,
      dataInput: {
        quantity: 20,
        skipedUsers,
      },
    })

    const { data } = fetchResponse.data

    const usersInDatabase = await AppDataSource.getRepository(User).find({
      order: {
        name: 'ASC',
      },
      relations: ['addresses'],
    })
    const usersFetchResponse = data.users.users

    usersFetchResponse.forEach((fetchUser, index) => {
      const dbUser = usersInDatabase.find((user) => user.id === fetchUser.id)!

      expect(fetchUser.name).that.is.a('string').to.equal(dbUser.name)
      expect(fetchUser.email).that.is.a('string').to.equal(dbUser.email)
      expect(fetchUser.id).that.is.a('string').to.equal(dbUser.id)
      expect(fetchUser.birthDate).that.is.a('string').to.equal(dbUser.birthDate)
      expect(usersInDatabase.indexOf(dbUser)).to.equal(index + skipedUsers)

      const fetchUserAddress = fetchUser.addresses[0]
      const dbUserAddress = dbUser.addresses[0]

      expect(fetchUserAddress.id).to.be.a('string').to.equal(dbUserAddress.id)
      expect(fetchUserAddress.cep).to.be.a('string').to.equal(dbUserAddress.cep)
      expect(fetchUserAddress.city).to.be.a('string').to.equal(dbUserAddress.city)
      expect(fetchUserAddress.complement).to.be.a('string').to.equal(dbUserAddress.complement)
      expect(fetchUserAddress.neighborhood).to.be.a('string').to.equal(dbUserAddress.neighborhood)
      expect(fetchUserAddress.state).to.be.a('string').to.equal(dbUserAddress.state)
      expect(fetchUserAddress.street).to.be.a('string').to.equal(dbUserAddress.street)
      expect(fetchUserAddress.streetNumber).to.be.a('string').to.equal(dbUserAddress.streetNumber)
    })
  })

  it('should not have more users before', async () => {
    const fetchResponse = await makeApiCall<IFetchUsersRequest, IFetchUsersResponse>({
      query,
      token,
      dataInput: {
        quantity: 20,
        skipedUsers: 1,
      },
    })

    const { data } = fetchResponse.data

    expect(data.users).to.have.property('hasMoreBefore').that.is.equal(false)
    expect(data.users).to.have.property('hasMoreAfter').that.is.equal(true)
    expect(data.users).to.have.property('users').to.have.length(20)
    expect(data.users).to.have.property('totalUsers').that.is.equal(51)
  })

  it('should have more users before', async () => {
    const skipedUsers = 30
    const fetchResponse = await makeApiCall<IFetchUsersRequest, IFetchUsersResponse>({
      query,
      token,
      dataInput: {
        quantity: 10,
        skipedUsers,
      },
    })

    const { data } = fetchResponse.data
    const usersInDatabase = await AppDataSource.getRepository(User).find({
      order: { name: 'ASC' },
      relations: ['addresses'],
    })
    const usersFetchResponse = data.users.users

    expect(data.users).to.have.property('hasMoreBefore').that.is.equal(true)
    expect(data.users).to.have.property('hasMoreAfter').that.is.equal(true)
    expect(data.users).to.have.property('users').to.have.length(10)
    expect(data.users).to.have.property('totalUsers').that.is.equal(51)

    usersFetchResponse.forEach((fetchUser, index) => {
      const dbUser = usersInDatabase.find((user) => user.id === fetchUser.id)!
      expect(fetchUser.name).that.is.a('string').to.equal(dbUser.name)
      expect(fetchUser.email).that.is.a('string').to.equal(dbUser.email)
      expect(fetchUser.id).that.is.a('string').to.equal(dbUser.id)
      expect(fetchUser.birthDate).that.is.a('string').to.equal(dbUser.birthDate)
      expect(usersInDatabase.indexOf(dbUser)).to.equal(index + skipedUsers)

      const fetchUserAddress = fetchUser.addresses[0]
      const dbUserAddress = dbUser.addresses[0]

      expect(fetchUserAddress.id).to.be.a('string').to.equal(dbUserAddress.id)
      expect(fetchUserAddress.cep).to.be.a('string').to.equal(dbUserAddress.cep)
      expect(fetchUserAddress.city).to.be.a('string').to.equal(dbUserAddress.city)
      expect(fetchUserAddress.complement).to.be.a('string').to.equal(dbUserAddress.complement)
      expect(fetchUserAddress.neighborhood).to.be.a('string').to.equal(dbUserAddress.neighborhood)
      expect(fetchUserAddress.state).to.be.a('string').to.equal(dbUserAddress.state)
      expect(fetchUserAddress.street).to.be.a('string').to.equal(dbUserAddress.street)
      expect(fetchUserAddress.streetNumber).to.be.a('string').to.equal(dbUserAddress.streetNumber)
    })
  })

  it('should not have more users after', async () => {
    const skipedUsers = 40
    const fetchResponse = await makeApiCall<IFetchUsersRequest, IFetchUsersResponse>({
      query,
      token,
      dataInput: {
        quantity: 20,
        skipedUsers,
      },
    })

    const { data } = fetchResponse.data
    const usersInDatabase = await AppDataSource.getRepository(User).find({
      order: {
        name: 'ASC',
      },
      relations: ['addresses'],
    })
    const usersFetchResponse = data.users.users

    expect(data.users).to.have.property('hasMoreBefore').that.is.equal(true)
    expect(data.users).to.have.property('hasMoreAfter').that.is.equal(false)
    expect(data.users).to.have.property('users').to.have.length(11)
    expect(data.users).to.have.property('totalUsers').that.is.equal(51)

    usersFetchResponse.forEach((fetchUser, index) => {
      const dbUser = usersInDatabase.find((user) => user.id === fetchUser.id)!
      expect(fetchUser.name).that.is.a('string').to.equal(dbUser.name)
      expect(fetchUser.email).that.is.a('string').to.equal(dbUser.email)
      expect(fetchUser.id).that.is.a('string').to.equal(dbUser.id)
      expect(fetchUser.birthDate).that.is.a('string').to.equal(dbUser.birthDate)
      expect(usersInDatabase.indexOf(dbUser)).to.equal(index + skipedUsers)

      const fetchUserAddress = fetchUser.addresses[0]
      const dbUserAddress = dbUser.addresses[0]

      expect(fetchUserAddress.id).to.be.a('string').to.equal(dbUserAddress.id)
      expect(fetchUserAddress.cep).to.be.a('string').to.equal(dbUserAddress.cep)
      expect(fetchUserAddress.city).to.be.a('string').to.equal(dbUserAddress.city)
      expect(fetchUserAddress.complement).to.be.a('string').to.equal(dbUserAddress.complement)
      expect(fetchUserAddress.neighborhood).to.be.a('string').to.equal(dbUserAddress.neighborhood)
      expect(fetchUserAddress.state).to.be.a('string').to.equal(dbUserAddress.state)
      expect(fetchUserAddress.street).to.be.a('string').to.equal(dbUserAddress.street)
      expect(fetchUserAddress.streetNumber).to.be.a('string').to.equal(dbUserAddress.streetNumber)
    })
  })

  it('should return users in alphabetical order', async () => {
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
      relations: ['addresses'],
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
