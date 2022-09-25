export const extend = Object.assign

export const isObject = (val: unknown) => val !== null && typeof val === 'object';
export const isString = (val: unknown) => val !== null && typeof val === 'string'

export const hasChange = (n1, n2) => !Object.is(n1, n2);