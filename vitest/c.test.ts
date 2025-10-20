import { prefixInc } from './counter.js'
import { expect, test } from 'vitest'

test('C', () => {
  expect(prefixInc()).toBe(1)
})
