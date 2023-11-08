import { after, describe, it } from 'mocha'
import { expect } from 'chai'
import axios from 'axios'
import { ApolloServer } from 'apollo-server'
import { resolvers, typeDefs } from '../../src/graphql'
import { AppDataSource } from '../../src/data-source'

describe('Query Test', () => {
  let server: ApolloServer

  before(async () => {
    server = new ApolloServer({ resolvers, typeDefs })
    return AppDataSource.initialize()
      .then(() => {
        console.log(`${process.env.DB_DATABASE}, ok.`)
        server.listen()
      })
      .catch((err) => {
        console.log('Error:', err)
      })
  })

  after(async () => {
    await AppDataSource.destroy()
  })

  it('should return Hello Taqtile', async () => {
    const queryResult = await axios.post('http://localhost:4000', {
      query: `
        query {
          hello
        }
      `,
    })
    const { data } = queryResult.data
    expect(data).to.have.property('hello').to.equal('Hello Taqtile')
  })
})
