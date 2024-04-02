import { expect } from 'vitest'
import { add } from '../index'

it.skip('init', () => {
  expect(add(2, 2)).toBe(4)
})
