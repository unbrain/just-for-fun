const Map = {
  $el: (i) => {
    return i.vnode.el
  }
}

export const PublicInstanceProxyHandlers = {
  get({_: instance}, key) {
    const { setupState, vnode } = instance;
    if(key in setupState) {
      return setupState[key];
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