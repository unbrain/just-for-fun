import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from './baseHandlers'

export enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
}

export function reactive(target) {
  return createReactiveObject(target, mutableHandlers)
}

export function readonly(target) {
  return createReactiveObject(target, readonlyHandlers)
}

export function shallowReadonly(target) {
  return createReactiveObject(target, shallowReadonlyHandlers)
}

export function isProxy(target) {
  return isReactive(target) || isReadonly(target)
}

export function isReactive(target) {
  return !!target[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(target) {
  return !!target[ReactiveFlags.IS_READONLY]
}

function createReactiveObject(target, baseHandlers) {
  return new Proxy(target, baseHandlers)
}
