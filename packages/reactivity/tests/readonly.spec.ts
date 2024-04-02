import { describe, expect, it, vi } from 'vitest'
import { isProxy, isReadonly, readonly } from '../reactive'

describe('readonly', () => {
  it('test', () => {
    const original = { foo: 1, baz: { a: 1 } }
    const wrapped = readonly(original)
    expect(wrapped).not.toBe(original)
    expect(wrapped.foo).toBe(1)
    expect(isReadonly(wrapped)).toBe(true)
    expect(isReadonly(wrapped.baz)).toBe(true)
    expect(isProxy(wrapped)).toBe(true)
    expect(isProxy(wrapped.baz)).toBe(true)
    expect(isReadonly(original)).toBe(false)
    expect(isProxy(original)).toBe(false)
  })

  it('get warn', () => {
    console.warn = vi.fn()
    const original = { foo: 1 }
    const wrapped = readonly(original)
    wrapped.foo = 2
    expect(console.warn).toBeCalled()
  })
})
