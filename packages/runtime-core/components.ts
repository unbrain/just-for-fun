import { type } from "os";
import { shallowReadonly } from "../reactivity/reactive";
import { initProps } from "./componentProps";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";

export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    el: null,
  }

  return component;
}


export function setupComponent(instance) {
  // TODO: initProps initSlots
  initProps(instance, instance.vnode.props);
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance) {
  const {type, props} = instance;
  const Component = type;
  instance.proxy = new Proxy({_:instance}, PublicInstanceProxyHandlers)
  const { setup } = Component;

  if (setup) {
    const setupResult = setup(shallowReadonly(props));

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

