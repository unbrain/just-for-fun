import { extend } from '../shared/index'

const targetsMap = new Map()
let activeEffect
let shouldTrack = false
export class ReactiveEffect {
  private _fn: any
  deps = []
  active = true
  onStop?: () => object
  constructor(fn, public scheduler?) {
    this._fn = fn
  }

  run() {
    if (!this.active)
      return this._fn()

    shouldTrack = true
    // eslint-disable-next-line ts/no-this-alias
    activeEffect = this
    const res = this._fn()
    shouldTrack = false
    return res
  }

  stop() {
    if (this.active) {
      clearupEffect(this)
      this.onStop && this.onStop()
    }
  }
}

function clearupEffect(effect) {
  effect.deps.forEach((dep) => {
    dep.delete(effect)
  })
}

export function needTrack() {
  return shouldTrack && activeEffect
}

export function track(target, key) {
  if (!needTrack())
    return
  // target(targetsMap) -> key -> dep(depsMap)
  let depsMap = targetsMap.get(target)

  if (!depsMap) {
    depsMap = new Map()
    targetsMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)

  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  trackEffect(dep)
}

export function trackEffect(dep) {
  dep.add(activeEffect)
  activeEffect.deps.push(dep)
}

export function trigger(target, key) {
  const depsMap = targetsMap.get(target)
  if (depsMap) {
    const dep = depsMap.get(key)
    dep && triggerEffect(dep)
  }
}

export function triggerEffect(dep) {
  for (const effect of dep)
    effect?.scheduler ? effect.scheduler() : effect.run()
}

export function stop(runner) {
  runner.effect.stop()
}

export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler)
  extend(_effect, options)
  _effect.run()
  const runner = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}
