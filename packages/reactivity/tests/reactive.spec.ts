import { describe, expect, it } from "vitest";
import { isProxy, isReactive, reactive } from '../reactive';
describe('reactive', () => {
  it('happy path', () => {
    const obj = { a: 1, b: [1,2] };
    const observed = reactive(obj);
    expect(observed).not.toBe(obj);
    expect(observed.a).toBe(1);
    expect(isReactive(observed)).toBe(true);
    expect(isReactive(observed.b)).toBe(true);
    expect(isProxy(observed)).toBe(true);
    expect(isProxy(observed.b)).toBe(true);
    expect(isReactive(obj)).toBe(false);
  })
})