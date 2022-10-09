import { getCurrentInstance } from "./components";

export function provide(key, value) {
  const currentInstance = getCurrentInstance() as any;
  console.log(currentInstance);
  if (currentInstance) {
    let { provides, parent } = currentInstance;
    const parentProvides = parent.provides;
    if (provides === parentProvides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}

export function inject(key, val) {
  const currentInstance = getCurrentInstance() as any;
  if (currentInstance) {
    if (currentInstance.parent.provides[key]) {
      return currentInstance.parent.provides[key]
    } else {
      if (typeof val === 'function') {
        return val();
      }
      return val;
    }
  }
}