import { describe, it } from 'mocha'
import assert from 'assert'

describe('Simples test', () => {
  it('should return hello world', () => {
    const result = 'hello world'
    assert.equal(result, 'hello world')
  })
})
