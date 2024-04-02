import { hasChange, isObject } from '../shared'
import { needTrack, trackEffect, triggerEffect } from './effect'
import { reactive } from './reactive'

class RefImpl {
  private _value: any
  dep: Set<unknown>
  private _targetValue: any
  public readonly __v_isRef = true
  constructor(value) {
    this._targetValue = value
    this._value = covert(value)
    this.dep = new Set()
  }

  get value() {
    trackRefValue(this)
    return this._value
  }

  set value(newValue) {
    if (hasChange(this._targetValue, newValue)) {
      this._targetValue = newValue
      this._value = covert(newValue)
      triggerEffect(this.dep)
    }
  }
}

function trackRefValue(ref) {
  if (needTrack())
    trackEffect(ref.dep)
}

function covert(value) {
  return isObject(value) ? reactive(value) : value
}

export function ref(target) {
  return new RefImpl(target)
}

export function isRef(ref) {
  return !!ref.__v_isRef
}

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref
}

export function proxyRefs(target) {
  return new Proxy(target, {
    get(target, value) {
      return isRef(target[value]) ? unRef(target[value]) : target[value]
    },

    set(target, key, value) {
      if (isRef(target[key]) && !isRef(value))
        return target[key].value = value
      else
        return Reflect.set(target, key, value)
    },
  })
}
