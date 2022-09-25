import { describe, expect, it } from "vitest";
import { effect } from "../effect";
import { reactive } from "../reactive";
import { isRef, ref, unRef } from "../ref";

describe('ref', () => {
  it('ref', () => {
    const dummy = ref(1);
    expect(dummy.value).toBe(1);
  })

  it('should be reactive', () => {
    const a = ref(1);
    let dummy;
    let calls = 0;
    effect(() => {
      calls++;
      dummy = a.value;
    });
    expect(calls).toBe(1);
    expect(dummy).toBe(1);
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
  })

  it('shoule mak nested properties reactive', () => {
    const a = ref({count: 1});
    let dummy;
    effect(() => {
      dummy = a.value.count;
    });
    expect(dummy).toBe(1);
    a.value.count = 2;
    expect(dummy).toBe(2);
  })

  
  it('isRef', () => {
    const dummy = ref(1);
    expect(isRef(dummy)).toBe(true);
    expect(isRef(reactive({a:1}))).toBe(false);
  })

  it('unRef', () => {
    const dummy = ref(1);
    expect(unRef(dummy)).toBe(1);
    expect(unRef(1)).toBe(1);
  })
})