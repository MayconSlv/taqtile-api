import { after, beforeEach, describe, it } from 'mocha'
import { AppDataSource } from '../../src/data-source'
import { User } from '../../src/entities/User'
import { makeApiCall } from '../../src/utils/make-api-call'
import { startServer } from '../../src/utils/start-server'
import { createApolloServer } from '../../src/lib/apollo'
import { ApolloServer } from 'apollo-server'
import { IGetUserRequest, IGetUserResposne } from '../../src/models'
import { createAndAuthenticateUser } from '../../src/utils/create-and-authenticate-user'
import { expect } from 'chai'
import { removeDataFromDatabase } from '../../src/utils/remove-data-from-db'

let token: string
let userId: string
let server: ApolloServer
const query = `query($data: GetUserInput) {
  user(data: $data) {
    name
    email
    id
    birthDate
    address {
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
}`

describe('Get User By ID', () => {
  before(async () => {
    server = createApolloServer()
    await startServer(server)
  })

  beforeEach(async () => {
    const user = await createAndAuthenticateUser()

    const repo = AppDataSource.getRepository(User)
    const { id } = await repo.findOneOrFail({
      where: { email: 'johndoe@email.com' },
    })

    userId = id
    token = user.token
  })

  afterEach(async () => {
    const userRepository = AppDataSource.getRepository(User)
    await removeDataFromDatabase<User>(userRepository)
  })

  after(async () => {
    await AppDataSource.destroy()
    await server.stop()
  })

  it('should be able to fetch a user', async () => {
    const fetchResponse = await makeApiCall<IGetUserRequest, IGetUserResposne>({
      query,
      dataInput: {
        userId,
      },
      token,
    })

    const { data } = fetchResponse.data
    expect(data).to.have.property('user')
    expect(data.user).to.have.property('name').that.is.a('string').to.equal('John Doe')
    expect(data.user).to.have.property('email').that.is.a('string').to.equal('johndoe@email.com')
    expect(data.user).to.have.property('birthDate').that.is.a('string').to.equal('12-12-1990')
    expect(data.user).to.have.property('id').that.is.a('string')
    expect(data.user).to.have.property('address').that.is.an('array')
    // cehck users address
    expect(data.user.address[0]).to.have.property('cep').that.is.a('string').to.equal('12345-678')
    expect(data.user.address[0]).to.have.property('city').that.is.a('string').to.equal('Javascript City')
    expect(data.user.address[0]).to.have.property('complement').that.is.a('string').to.equal('Typecript')
    expect(data.user.address[0]).to.have.property('neighborhood').that.is.a('string').to.equal('Java')
    expect(data.user.address[0]).to.have.property('state').that.is.a('string').to.equal('JS')
    expect(data.user.address[0]).to.have.property('street').that.is.a('string').to.equal('Javascript Street')
    expect(data.user.address[0]).to.have.property('streetNumber').that.is.a('string').to.equal('123')
  })

  it('should not be able to fetch a user with invalid token', async () => {
    const fetchResponse = await makeApiCall<IGetUserRequest, IGetUserResposne>({
      token: 'invalid-token',
      query,
      dataInput: {
        userId,
      },
    })

    const { errors } = fetchResponse.data
    expect(errors[0]).to.have.property('message').that.is.equal('UNAUTHORIZED.')
  })

  it('should not be able to fetch a user with wrong ID', async () => {
    const wrongUUID = '85f8c058-0e33-4d90-92f3-73461f05d9da'

    const fetchResponse = await makeApiCall<IGetUserRequest, IGetUserResposne>({
      token,
      query,
      dataInput: {
        userId: wrongUUID,
      },
    })

    const { errors } = fetchResponse.data
    expect(errors[0]).to.have.property('message').that.is.equal('Resource not found error.')
  })
})
