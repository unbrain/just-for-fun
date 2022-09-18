import {extend} from '../shared/index'
class ReactiveEffect {
  private _fn: any;
  deps = [];
  actived = true;
  onStop ?:() => {};
  constructor(fn, public scheduler?) {
    this._fn = fn;
  }

  run() {
    activeEffect = this;
    return this._fn();
  }

  stop() {
    if(this.actived) {
      clearupEffect(this);
      this.onStop && this.onStop();
      this.actived = false;
    }
  }
}

function clearupEffect(effect) {
  effect.deps.forEach(dep => {
    dep.delete(effect);
  });
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

  if(!activeEffect) return;
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
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

export function stop(runner) {
  runner.effect.stop();
}

let activeEffect;
export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  extend(_effect, options);
  _effect.run();
  const runner =_effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}