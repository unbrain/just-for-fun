import { extend, isObject } from "../shared";
import { track, trigger } from "./effect";
import { reactive, ReactiveFlags, readonly } from "./reactive";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true)

function createGetter(isReadonly = false, isShallow = false) {
  return function (target, key) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    }
    const res = Reflect.get(target, key);
    if (isObject(res) && !isShallow) {
      return isReadonly ? readonly(res) : reactive(res)
    }
    // TODO: 依赖收集
    if (!isReadonly) {
      track(target, key);
    }
    return res;
  }
}

function createSetter() {
  return function (target, key, value) {
    const res = Reflect.set(target, key, value);
    //TODO: fn触发依赖
    trigger(target, key);
    return res;
  }
}

export const mutableHandlers = {
  get,
  set,
}

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target)
    return true;
  }
}
export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet
})