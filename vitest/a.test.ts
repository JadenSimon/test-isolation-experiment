import { prefixInc } from './counter.js'
import { expect, test } from 'vitest'

test('A', () => {
  expect(prefixInc()).toBe(1)
})
