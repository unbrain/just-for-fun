import { PublicInstanceProxyHandlers } from "./componentPublicInstance";

export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    el: null
  }

  return component;
}


export function setupComponent(instance) {
  // TODO: initProps initSlots

  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance) {
  const Component = instance.type;
  instance.proxy = new Proxy({_:instance}, PublicInstanceProxyHandlers)
  const { setup } = Component;

  if (setup) {
    const setupResult = setup();

    handleSetupResult(instance, setupResult);
  }
}


function handleSetupResult(instance: any, setupResult) {
  //TODO: function
  if (typeof setupResult === 'object') {
    instance.setupState = setupResult;
  }

  finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
  const Component = instance.type;
  // if (Component?.render) {
    instance.render = Component.render;
  // } 
}

