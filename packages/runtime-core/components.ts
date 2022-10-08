import { type } from "os";
import { proxyRefs } from "../reactivity";
import { shallowReadonly } from "../reactivity/reactive";
import { initSlots } from "./compoenentSlots";
import { emit } from "./componentEmits";
import { initProps } from "./componentProps";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";

export function createComponentInstance(vnode, parent) {
  const component = {
    vnode,
    parent,
    type: vnode.type,
    setupState: {},
    el: null,
    slots: {},
    emit: () => { },
    provides: parent ? parent.provides : {},
    isMounted: false,
  }
  component.emit = emit.bind(null, component)

  return component;
}


export function setupComponent(instance) {
  // TODO: initProps initSlots
  initProps(instance, instance.vnode.props);
  initSlots(instance, instance.vnode.children);
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance) {
  const { type, props, emit } = instance;
  const Component = type;
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers)
  const { setup } = Component;

  if (setup) {
    setCurrentInstance(instance);
    const setupResult = proxyRefs(setup(shallowReadonly(props), { emit }));
    console.log(setupResult);
    setCurrentInstance(null);

    handleSetupResult(instance, setupResult);
  }
}
let currentInstance = null;
export function getCurrentInstance() {
  return currentInstance;
};

function setCurrentInstance(instance) {
  currentInstance = instance
};

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

