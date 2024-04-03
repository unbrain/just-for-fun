import { describe, expect, it, vi } from 'vitest'
import { reactive } from '../src/reactive'
import { computed } from '../src/computed'

describe('computed', () => {
  it('hh', () => {
    const user = reactive({ age: 1 })
    const age = computed(() => {
      return user.age
    })

    expect(age.value).toBe(1)
  })

  it('should computed lazily', () => {
    const value = reactive({
      foo: 1,
    })

    const getter = vi.fn(() => {
      return value.foo
    })

    const computedValue = computed(getter)

    expect(computedValue.value).toBe(1)
    expect(getter).toHaveBeenCalledTimes(1)

    // should not computed again
    computedValue.value
    expect(getter).toHaveBeenCalledTimes(1)

    // should not computed until need
    value.foo = 2
    expect(getter).toHaveBeenCalledTimes(1)

    // now it should be computed
    expect(computedValue.value).toBe(2)
    expect(getter).toHaveBeenCalledTimes(2)

    computedValue.value
    expect(getter).toHaveBeenCalledTimes(2)
  })
})
