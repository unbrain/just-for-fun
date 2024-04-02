import { describe, expect, it, vi } from 'vitest'
import { isReadonly, shallowReadonly } from '../reactive'

describe('shallowReadony', () => {
  it('test', () => {
    const original = { foo: 1, baz: { a: 1 } }
    const wrapped = shallowReadonly(original)
    expect(wrapped).not.toBe(original)
    expect(wrapped.foo).toBe(1)
    expect(isReadonly(wrapped)).toBe(true)
    expect(isReadonly(wrapped.baz)).toBe(false)
  })

  it('get warn', () => {
    console.warn = vi.fn()
    const original = { foo: 1 }
    const wrapped = shallowReadonly (original)
    wrapped.foo = 2
    expect(console.warn).toBeCalled()
  })
})
