class ReactiveEffect {
  private _fn: any;
  constructor(fn, public scheduler?) {
    this._fn = fn;
  }

  run() {
    activeEffect = this;
    return this._fn();
  }
}

const targetsMap = new Map();

export function track(target, key) {
  // target(targetsMap) -> key -> dep(depsMap) 
  let depsMap = targetsMap.get(target)

  if (!depsMap) {
    depsMap = new Map();
    targetsMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);

  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }

  dep.add(activeEffect);
}

export function trigger(target, key) {
  const depsMap = targetsMap.get(target);
  if (depsMap) {
    const dep = depsMap.get(key);
    if (dep) {
      for (let effect of dep) {
        effect?.scheduler ? effect.scheduler() : effect.run();
      }
    }
  }
}

let activeEffect;
export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  _effect.run();
  return _effect.run.bind(_effect);
}