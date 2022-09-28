import { hasOwn } from "../shared";

const Map = {
  $el: (i) => {
    return i.vnode.el
  }
}

export const PublicInstanceProxyHandlers = {
  get({_: instance}, key) {
    const { setupState, props, vnode } = instance;
    if(hasOwn(setupState, key)) {
      return setupState[key];
    } else if(hasOwn(props, key)) {
      return props[key];
    }

    // if(key === '$el') {
    //   return vnode.el;
    // }

    const MapGetter = Map[key]

    if(MapGetter) {
      return MapGetter(instance);
    }
  }
}