import { after, describe, it } from 'mocha'
import { ApolloServer } from 'apollo-server'
import { resolvers, typeDefs } from '../../src/graphql'
import { AppDataSource } from '../../src/data-source'
import { startServer } from '../../src/utils/start-server'
import { User } from '../../src/entities/User'
import { CreateUserService } from '../../src/services/create-user-service'
import { ILoginRequest, ILoginResponse } from '../../src/models'
import { expect } from 'chai'
import { makeApiCall } from '../../src/utils/make-api-call'

describe('Query Test', () => {
  let server: ApolloServer

  before(async () => {
    server = new ApolloServer({ resolvers, typeDefs })
    return startServer(server)
  })

  afterEach(async () => {
    const userRepository = AppDataSource.getRepository(User)
    await userRepository.clear()
  })

  after(async () => {
    await AppDataSource.destroy()
    await server.stop()
  })

  it('should be able to authenticate a user', async () => {
    const createUser = new CreateUserService()
    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      birthDate: '12-12-1990',
      password: '123456a',
    })

    const authResponse = await makeApiCall<ILoginRequest, ILoginResponse>({
      query: `mutation ($data: LoginInput) {
      login(data: $data) {
        token user {
          name email id birthDate
        }
      }
    }`,
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
    const createUser = new CreateUserService()
    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      birthDate: '12-12-1990',
      password: '123456a',
    })

    const authResponse = await makeApiCall<ILoginRequest, ILoginResponse>({
      query: `mutation ($data: LoginInput) {
      login(data: $data) {
        token user {
          name email id birthDate
        }
      }
    }`,
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
    const createUser = new CreateUserService()
    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      birthDate: '12-12-1990',
      password: '123456a',
    })

    const authResponse = await makeApiCall<ILoginRequest, ILoginResponse>({
      query: `mutation ($data: LoginInput) {
      login(data: $data) {
        token user {
          name email id birthDate
        }
      }
    }`,
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
