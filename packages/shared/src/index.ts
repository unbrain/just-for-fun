export const extend = Object.assign

export const EMPTY_OBJ = {}
export const isObject = (val: unknown) => val !== null && typeof val === 'object'
export const isString = (val: unknown) => val !== null && typeof val === 'string'

export const hasChange = (n1: any, n2: any) => !Object.is(n1, n2)

export const hasOwn = (target: any, key: any) => Object.prototype.hasOwnProperty.call(target, key)
export function capitalize(str: string) {
  return str.charAt(0).toLocaleUpperCase() + str.slice(1)
}
export function camelize(str: string) {
  return str.replace(/-(\w)/g, (_, str: string) => {
    return str ? str.toLocaleUpperCase() : ''
  })
}

export { ShapeFlags } from './ShapeFlags'
