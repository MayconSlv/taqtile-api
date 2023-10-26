import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'
const server = express()

const schema = buildSchema(`
  type Query {
    hello: String!
  }
`)

const root = {
  hello: () => {
    return "Hello, world!"
  }
}

server.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
)

server.listen(4000, () => {
  console.log(`HTTP server is running on http://localhost:4000`)
})
