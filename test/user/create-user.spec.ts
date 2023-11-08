import { describe, it, before } from 'mocha'
import { expect } from 'chai'
import axios from 'axios'
import { ApolloServer } from 'apollo-server'
import { resolvers, typeDefs } from '../../src/graphql'
import { AppDataSource } from '../../src/data-source'
import { User } from '../../src/entities/User'

describe('Create User E2E', () => {
  let server: ApolloServer

  before(async () => {
    server = new ApolloServer({ resolvers, typeDefs })

    return AppDataSource.initialize()
      .then(() => {
        console.log(`${process.env.DB_DATABASE} ok`)
        server.listen()
      })
      .catch((err) => {
        console.log(err)
      })
  })

  after(async () => {
    const userRepository = AppDataSource.getRepository(User)
    await userRepository.clear()

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
            id name
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
  })

  it('should not be able to create a user with same email twice', async () => {
    const userInput = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456a',
      birthDate: '05-30-2002',
    }

    await axios({
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
})
