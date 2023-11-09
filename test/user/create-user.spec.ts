import { describe, it, before, afterEach } from 'mocha'
import { expect } from 'chai'
import { ApolloServer } from 'apollo-server'
import { resolvers, typeDefs } from '../../src/graphql'
import { AppDataSource } from '../../src/data-source'
import { User } from '../../src/entities/User'
import { startServer } from '../../src/utils/start-server'
import { makeApiCall } from '../../src/utils/make-api-call'
import { compare } from 'bcryptjs'

describe('Create User E2E', () => {
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

  it('should be able to crate a user', async () => {
    const userInput = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456a',
      birthDate: '05-30-2002',
    }

    const query = `mutation($data: UserInput!) {
          createUser(data: $data) {
            id name email birthDate
          }
        }`

    const response = await makeApiCall({
      query,
      dataInput: userInput,
    })

    // validate api response
    const { data } = response.data
    expect(data.createUser).to.have.property('id').that.is.a('string')
    expect(data.createUser).to.have.property('name').that.is.equal('John Doe')
    expect(data.createUser).to.have.property('email').that.is.equal('johndoe@example.com')
    expect(data.createUser).to.have.property('birthDate').that.is.equal('05-30-2002')

    // validate user in database
    const user = await AppDataSource.getRepository(User).findOneOrFail({ where: { email: userInput.email } })
    expect(user).to.have.property('id').that.is.a('string')
    expect(user).to.have.property('birthDate').that.is.a('string').to.equal('05-30-2002')
    expect(user).to.have.property('name').that.is.a('string').to.equal('John Doe')
    expect(user).to.have.property('email').that.is.a('string').to.equal('johndoe@example.com')

    // compare hashed password
    const password = await compare(userInput.password, user.passwordHash)
    expect(user).to.have.property('passwordHash').that.is.a('string')
    expect(password).to.equal(true)
  })

  it('should not be able to create a user with same email twice', async () => {
    const userInput = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456a',
      birthDate: '05-30-2002',
    }

    const userRepository = AppDataSource.getRepository(User)
    await userRepository.save({
      name: 'John Doe',
      email: 'johndoe@example.com',
      birthDate: '05-30-2002',
      passwordHash: '123456a',
    })

    const query = `mutation($data: UserInput!) {
      createUser(data: $data) {
        id name email birthDate
      }
    }`

    const response = await makeApiCall({
      query,
      dataInput: userInput,
    })

    const { errors } = response.data
    expect(errors[0]).to.be.an('object')
    expect(errors[0]).to.have.property('message').that.is.equal('User already exists with same email.')
  })

  it('should not be able create a user with weak password', async () => {
    const userInput = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      birthDate: '05-30-2002',
    }

    const query = `mutation($data: UserInput!) {
      createUser(data: $data) {
        id name email birthDate
      }
    }`

    const response = await makeApiCall({
      query,
      dataInput: userInput,
    })

    const errorMessage = response.data.errors[0].message
    const error = JSON.parse(errorMessage)

    expect(error[0]).to.have.property('message').that.is.equal('The password must contain 1 letter and 1 digit.')
  })

  it('should not be able to create a user with invalid email', async () => {
    const userInput = {
      name: 'John Doe',
      email: 'invalidEmail',
      password: '123456a',
      birthDate: '05-30-2002',
    }

    const query = `mutation($data: UserInput!) {
      createUser(data: $data) {
        id name email birthDate
      }
    }`

    const response = await makeApiCall({
      query,
      dataInput: userInput,
    })

    const errorMessage = response.data.errors[0].message
    const error = JSON.parse(errorMessage)

    expect(error[0]).to.have.property('message').that.is.equal('Invalid email')
  })
})
