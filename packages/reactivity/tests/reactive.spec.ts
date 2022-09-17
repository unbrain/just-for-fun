import { describe, expect, it } from "vitest";
import { reactive } from '../reactive';
describe('reactive', () => {
  it('happy path', () => {
    const obj = {a: 1};
    const observed = reactive(obj);
    expect(observed).not.toBe(obj);
    expect(observed.a).toBe(1);
  })
})