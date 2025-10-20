# Exploring isolated test closures

Isolation for each test case, not just per-file, is the inevitable goal of test isolation. How to make that happen is where people diverge. 

With my tool, [Synapse](https://github.com/Cohesible/synapse), something like this becomes practical:

```ts
let c = 0 

test('A', () => { 
    expect(++c).toBe(1)
}) 

test('B', () => {
    expect(++c).toBe(1)
})
```

This isn't too difficult to implement, but simple solutions often sacrifice performance or flexibility. 

For example, one could write a test runner that reloads the entire program for each test. That doesn't scale.

My approach works a bit differently: each test closure is serialized during "compilation" after evaluating the top-level scope. Only values referenced by the closure are included in the serialized output.

The entire program state, even across modules, can be serialized. This serialization focuses on semantic parity. Nearly complete parity should be possible with more work. 

## Performance experiments

It's difficult to directly compare performance with this serialization approach vs. existing frameworks without oversimplifying. 

Still, a rough analysis is useful to get an idea of where the costs are. 

Serialization is **_not_** an outright replacement for existing frameworks but could become a useful building block.

### Vitest

The [vitest directory](./vitest/) contains 3 test files, each containing 1 test to increment a shared counter.

I ran `vitest` with `--no-file-parallelism --no-watch` 3 times and took the lowest overall tool-reported duration as I added more files to the command:

| # Files  | Duration |
|----------|----------|
| 1        | 119ms    |
| 2        | 217ms    |
| 3        | 316ms    |


`--no-file-parallelism` is used to focus on single-threaded throughput as Synapse is not yet multi-threaded. Each file added 100ms.

### Synapse

For the serialization approach, I made 1 file with N unit tests (adjusted manually) that all incremented the same counter, recording the total wall time with `time synapse test --no-cache`:

| # Tests  | Duration |
|----------|----------|
| 1        | 202ms    |
| 2        | 212ms    |
| 3        | 226ms    |


Most of time is in compilation, not execution, at around 50:1. Each new test added 10ms or 10x faster than Vitest **for this specific example**.

The difference in implementations makes any extrapolation over scale/complexity practically impossible.

### Bun (no isolation)

Bun does not have a built-in way to run isolated tests AFAIK. 

We can still use it as lower bound for how fast tests could be. This is roughly the speed limit for any JS-based test harness without isolation overhead.

I had to adjust the tests so they didn't fail from the lack of isolation. `bun test --max-concurrency=1` on the adjusted Vitest code gave:

| # Tests  | Duration |
|----------|----------|
| 1        | 7ms      |
| 2        | 8ms      |
| 3        | 9ms      |

Giving a clean 1ms per test file
