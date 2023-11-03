import { after, describe, it } from 'mocha'
import { expect } from 'chai'
import axios from 'axios'
import { DataSource } from 'typeorm'
import { join } from 'node:path'
import { ApolloServer } from 'apollo-server'
import { resolvers, typeDefs } from '../../src/graphql'

describe('Query Test', () => {
  const TestDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'admin',
    password: 'admin',
    database: 'testdb',
    synchronize: true,
    entities: [join(__dirname, '../../src/entities/*.ts')],
  })

  before(async () => {
    const server = new ApolloServer({ resolvers, typeDefs })
    return TestDataSource.initialize()
      .then(() => {
        console.log('TestDatabase OK.')
        server.listen().then(({ url }) => console.log(url))
      })
      .catch((err) => {
        console.log('Error:', err)
      })
  })

  after(async () => {
    await TestDataSource.destroy()
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
    expect(data).to.have.property('hello')
    expect(data).to.have.property('hello').to.equal('Hello Taqtile')
  })
})
