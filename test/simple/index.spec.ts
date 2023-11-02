import { before, describe, it } from 'mocha'
import axios from 'axios'
import assert from 'assert'

describe('Simples test', () => {
  before(async () => {
    const queryResult = await axios.post('http://localhost:4000', {
      query: `
        query {
          hello
        }
      `,
    })
    const { data } = queryResult.data
    console.log(data)
  })

  it('should return hello world', () => {
    const result = 'hello world'
    assert.equal(result, 'hello world')
  })
})
