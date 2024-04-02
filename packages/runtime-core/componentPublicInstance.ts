import { hasOwn } from '../shared'

const Map = {
  $el: (i) => {
    return i.vnode.el
  },
  $slots: i => i.slots,
}

export const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { setupState, props } = instance
    // console.log(key, 'xxx', hasOwn(setupState, key), hasOwn(props, key));
    if (hasOwn(setupState, key))
      return setupState[key]
    else if (hasOwn(props, key))
      return props[key]

    // if(key === '$el') {
    //   return vnode.el;
    // }

    const MapGetter = Map[key]
    // console.log(key, 'xxx', Map[key], MapGetter(instance), instance);

    if (MapGetter)
      return MapGetter(instance)
  },
}
