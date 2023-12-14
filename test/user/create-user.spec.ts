import { describe, it, before, afterEach, beforeEach } from 'mocha'
import { expect } from 'chai'
import { AppDataSource } from '../../src/data-source'
import { User } from '../../src/entities/User'
import { startServer } from '../../src/utils/start-server'
import { makeApiCall } from '../../src/utils/make-api-call'
import { compare } from 'bcryptjs'
import { ICreateUserRequest, ICreateUserResponse } from '../../src/models'
import { createAndAuthenticateUser } from '../../src/utils/create-and-authenticate-user'
import { createApolloServer } from '../../src/lib/apollo'
import { ApolloServer } from 'apollo-server'
import { removeDataFromDatabase } from '../../src/utils/remove-data-from-db'

let token: string
let server: ApolloServer
const query = `mutation($data: CreateUserInput!) {
    createUser(data: $data) {
      id name email birthDate
    }
  }`

describe('Create User', () => {
  before(async () => {
    server = await createApolloServer()
    return startServer(server)
  })

  beforeEach(async () => {
    const user = await createAndAuthenticateUser()
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

  it('should be able to crate a user', async () => {
    const response = await makeApiCall<ICreateUserRequest, ICreateUserResponse>({
      token,
      query,
      dataInput: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456a',
        birthDate: '05-30-2002',
      },
    })

    // validate api response
    const { data } = response.data
    expect(data.createUser).to.have.property('id').that.is.a('string')
    expect(data.createUser).to.have.property('name').that.is.equal('John Doe')
    expect(data.createUser).to.have.property('email').that.is.equal('johndoe@example.com')
    expect(data.createUser).to.have.property('birthDate').that.is.equal('05-30-2002')

    // validate user in database
    const user = await AppDataSource.getRepository(User).findOneOrFail({ where: { email: 'johndoe@example.com' } })
    expect(user).to.have.property('id').that.is.a('string')
    expect(user).to.have.property('birthDate').that.is.a('string').to.equal('05-30-2002')
    expect(user).to.have.property('name').that.is.a('string').to.equal('John Doe')
    expect(user).to.have.property('email').that.is.a('string').to.equal('johndoe@example.com')

    // compare hashed password
    const password = await compare('123456a', user.passwordHash)
    expect(user).to.have.property('passwordHash').that.is.a('string')
    expect(password).to.equal(true)
  })

  it('should not be able to create a user with invalid token', async () => {
    const response = await makeApiCall<ICreateUserRequest, ICreateUserResponse>({
      token: 'invalid-token',
      query,
      dataInput: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456a',
        birthDate: '05-30-2002',
      },
    })

    const { errors } = response.data
    expect(errors[0]).to.have.property('message').that.is.equal('UNAUTHORIZED.')
  })

  it('should not be able to create a user with same email twice', async () => {
    const userRepository = AppDataSource.getRepository(User)
    await userRepository.save({
      name: 'John Doe',
      email: 'johndoe@example.com',
      birthDate: '05-30-2002',
      passwordHash: '123456a',
    })

    const response = await makeApiCall<ICreateUserRequest, ICreateUserResponse>({
      query,
      dataInput: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456a',
        birthDate: '05-30-2002',
      },
      token,
    })

    const { errors } = response.data
    expect(errors[0]).to.be.an('object')
    expect(errors[0]).to.have.property('message').that.is.equal('User already exists with same email.')
  })

  it('should not be able create a password without letters', async () => {
    const response = await makeApiCall<ICreateUserRequest, ICreateUserResponse>({
      query,
      dataInput: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456', // password without letters
        birthDate: '05-30-2002',
      },
      token,
    })

    const { errors } = response.data
    const errorMessage = errors[0].extensions?.exception?.validationErrors![0]?.constraints
    expect(errorMessage)
      .to.have.property('PasswordValidator')
      .that.is.equal('The password must contain 1 letter and 1 digit.')
  })

  it('should not be able create a password without numbers', async () => {
    const response = await makeApiCall<ICreateUserRequest, ICreateUserResponse>({
      query,
      dataInput: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'johndoe', // password without numbers
        birthDate: '05-30-2002',
      },
      token,
    })

    const { errors } = response.data
    const errorMessage = errors[0].extensions?.exception?.validationErrors![0]?.constraints
    expect(errorMessage)
      .to.have.property('PasswordValidator')
      .that.is.equal('The password must contain 1 letter and 1 digit.')
  })

  it('should not be able to create a password with less than 6 characters', async () => {
    const response = await makeApiCall<ICreateUserRequest, ICreateUserResponse>({
      query,
      dataInput: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '12345', // password with 5 characters
        birthDate: '05-30-2002',
      },
      token,
    })

    const { errors } = response.data
    const errorMessage = errors[0].extensions?.exception?.validationErrors![0]?.constraints
    expect(errorMessage).to.have.property('minLength').that.is.equal('The password must contain 6 characters.')
  })

  it('should not be able to create a user with invalid email', async () => {
    const response = await makeApiCall<ICreateUserRequest, ICreateUserResponse>({
      query,
      dataInput: {
        name: 'John Doe',
        email: 'invalidEmail', // invalid email
        password: '12345',
        birthDate: '05-30-2002',
      },
      token,
    })

    const { errors } = response.data
    const errorMessage = errors[0].extensions?.exception?.validationErrors![0]?.constraints
    expect(errorMessage).to.have.property('isEmail').that.is.equal('email must be an email')
  })
})
