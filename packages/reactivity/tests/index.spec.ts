import { expect, test } from 'vitest'
import { add } from '../index';

test.skip('init', () => {
  expect(add(2, 2)).toBe(4);
})