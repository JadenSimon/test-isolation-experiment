import { prefixInc } from './counter.js'
import { expect, test } from 'vitest'

test('B', () => {
  expect(prefixInc()).toBe(1)
})