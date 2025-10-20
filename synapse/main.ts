import { test, expectEqual } from 'synapse:test'

// Run `synapse destroy` before each run to get
// the most accurate timings

let c = 0

test('A', () => {
    expectEqual(++c, 1) 
})

test('B', () => {
    expectEqual(++c, 1) 
})

test('C', () => {
    expectEqual(++c, 1) 
})

