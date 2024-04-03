import { describe, expect, it, vi } from 'vitest'
import { reactive } from '../src/reactive'
import { effect, stop } from '../src/effect'

describe('effect', () => {
  it('happy path', () => {
    const user = reactive({
      age: 10,
    })

    let curAge

    effect(() => {
      curAge = user.age + 1
    })

    expect(curAge).toBe(11)

    user.age++

    expect(curAge).toBe(12)
  })

  it('return runner', () => {
    // 1. effect(fn) -> function(runner) -> return fn

    let number = 0
    const runner = effect(() => {
      number++
      return 'number'
    })

    expect(number).toBe(1)
    const r = runner()
    expect(number).toBe(2)
    expect(r).toBe('number')
  })

  it('scheduler', () => {
    // 默认执行 run 不执行 scheduler 副作用时粗发 不执行 run 执行 scheduler
    let dummy
    let run: any
    const scheduler = vi.fn(() => {
      // eslint-disable-next-line ts/no-use-before-define
      run = runner
    })
    const obj = reactive({ foo: 1 })
    const runner = effect(() => {
      dummy = obj.foo
    }, { scheduler })

    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)
    obj.foo++
    expect(scheduler).toHaveBeenCalledTimes(1)
    expect(dummy).toBe(1)
    run()
    expect(dummy).toBe(2)
  })

  it('shop', () => {
    let dummy
    const obj = reactive({ a: 1 })
    const runner = effect(() => {
      dummy = obj.a
    })
    expect(dummy).toBe(1)
    obj.a = 2
    expect(dummy).toBe(2)
    stop(runner)
    obj.a = 3
    expect(dummy).toBe(2)
    obj.a++
    expect(dummy).toBe(2)
    runner()
    expect(dummy).toBe(4)
  })

  it('events: onstop', () => {
    const onStop = vi.fn()
    const runner = effect(() => {}, { onStop })
    stop(runner)
    expect(onStop).toHaveBeenCalled()
  })
})
