// first test with jest

import { returnX } from '.'

describe('first test', () => {
  it('should be true', () => {
    expect(returnX()).toBe(1)
  })
})
