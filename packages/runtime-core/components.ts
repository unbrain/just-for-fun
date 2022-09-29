import { type } from "os";
import { shallowReadonly } from "../reactivity/reactive";
import { emit } from "./componentEmits";
import { initProps } from "./componentProps";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";

export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    el: null,
    emit: () => {},
  }

  component.emit = emit.bind(null, component)

  return component;
}


export function setupComponent(instance) {
  // TODO: initProps initSlots
  initProps(instance, instance.vnode.props);
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance) {
  const { type, props, emit } = instance;
  const Component = type;
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers)
  const { setup } = Component;

  if (setup) {
    const setupResult = setup(shallowReadonly(props), { emit });

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

