import { describe, it, before, afterEach } from 'mocha'
import { expect } from 'chai'
import axios from 'axios'
import { ApolloServer } from 'apollo-server'
import { resolvers, typeDefs } from '../../src/graphql'
import { AppDataSource } from '../../src/data-source'
import { User } from '../../src/entities/User'
import { startServer } from '../../src/utils/start-server'

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

    const response = await axios({
      url: 'http://localhost:4000',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      data: {
        query: `mutation($data: UserInput!) {
          createUser(data: $data) {
            id name email birthDate
          }
        }`,
        variables: {
          data: userInput,
        },
      },
    })

    const { data } = response.data
    expect(data.createUser).to.have.property('id').that.is.a('string')
    expect(data.createUser).to.have.property('name').that.is.equal('John Doe')
    expect(data.createUser).to.have.property('email').that.is.equal('johndoe@example.com')
    expect(data.createUser).to.have.property('birthDate').that.is.equal('05-30-2002')
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

    const response = await axios({
      url: 'http://localhost:4000',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      data: {
        query: `mutation($data: UserInput!) {
          createUser(data: $data) {
            id name
          }
        }`,
        variables: {
          data: userInput,
        },
      },
    })

    const { errors } = response.data
    expect(errors[0]).to.be.an('object')
    expect(errors[0]).to.have.property('message').that.is.equal('Email address already exists')
  })

  it('should not be able create a user with weak password', async () => {
    const userInput = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      birthDate: '05-30-2002',
    }

    const response = await axios({
      url: 'http://localhost:4000',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      data: {
        query: `mutation($data: UserInput!) {
          createUser(data: $data) {
            id name email birthDate
          }
        }`,
        variables: {
          data: userInput,
        },
      },
    })

    expect(response.data).to.have.property('errors')
  })

  it('should not be able to create a user with invalid email', async () => {
    const userInput = {
      name: 'John Doe',
      email: 'invalidEmail',
      password: '123456a',
      birthDate: '05-30-2002',
    }

    const response = await axios({
      url: 'http://localhost:4000',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      data: {
        query: `mutation($data: UserInput!) {
          createUser(data: $data) {
            id name email birthDate
          }
        }`,
        variables: {
          data: userInput,
        },
      },
    })

    expect(response.data).to.have.property('errors')
  })
})
