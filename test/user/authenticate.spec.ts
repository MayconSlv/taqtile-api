import { after, beforeEach, describe, it } from 'mocha'
import { AppDataSource } from '../../src/data-source'
import { User } from '../../src/entities/User'
import { ILoginRequest, ILoginResponse } from '../../src/models'
import { expect } from 'chai'
import { makeApiCall } from '../../src/utils/make-api-call'
import { hash } from 'bcryptjs'
import { startServer } from '../../src/utils/start-server'
import { createApolloServer } from '../../src/lib/apollo'
import { ApolloServer } from 'apollo-server'
import { removeDataFromDatabase } from '../../src/utils/remove-data-from-db'

let server: ApolloServer
const query = `mutation ($data: LoginInput) {
  login(data: $data) {
    token,
    user {
      name email id birthDate
    }
  }
}`

describe('Authenticate User', () => {
  before(async () => {
    server = createApolloServer()
    await startServer(server)
  })

  beforeEach(async () => {
    const passwordHash = await hash('123456a', 6)

    const repo = AppDataSource.getRepository(User)
    await repo.save({
      name: 'John Doe',
      email: 'johndoe@email.com',
      birthDate: '12-12-1990',
      passwordHash,
    })
  })

  afterEach(async () => {
    const userRepository = AppDataSource.getRepository(User)
    await removeDataFromDatabase<User>(userRepository)
  })

  after(async () => {
    await AppDataSource.destroy()
    await server.stop()
  })

  it('should be able to authenticate a user', async () => {
    const authResponse = await makeApiCall<ILoginRequest, ILoginResponse>({
      query,
      dataInput: {
        email: 'johndoe@email.com',
        password: '123456a',
        rememberMe: false,
      },
    })

    const { data } = authResponse.data
    expect(data.login.token).that.is.a('string')
    expect(data.login.user).to.have.property('id').that.is.a('string')
    expect(data.login.user).to.have.property('name').that.is.a('string').to.equal('John Doe')
    expect(data.login.user).to.have.property('email').that.is.a('string').to.equal('johndoe@email.com')
    expect(data.login.user).to.have.property('birthDate').that.is.a('string').to.equal('12-12-1990')
  })

  it('should not be able to authenticate a user with wrong email', async () => {
    const authResponse = await makeApiCall<ILoginRequest, ILoginResponse>({
      query,
      dataInput: {
        email: 'wrong@email.com',
        password: '123456a',
        rememberMe: false,
      },
    })

    const { errors } = authResponse.data
    expect(errors[0]).to.have.property('message').that.is.equal('Invalid credentials error.')
  })

  it('should not be able to authenticate a user with wrong password', async () => {
    const authResponse = await makeApiCall<ILoginRequest, ILoginResponse>({
      query,
      dataInput: {
        email: 'johndoe@email.com',
        password: 'wrongpassword',
        rememberMe: false,
      },
    })

    const { errors } = authResponse.data
    expect(errors[0]).to.have.property('message').that.is.equal('Invalid credentials error.')
  })
})
