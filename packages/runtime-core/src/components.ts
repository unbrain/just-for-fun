import { proxyRefs, shallowReadonly } from '@zy/reactivity'
import { initSlots } from './componentSlots'
import { emit } from './componentEmits'
import { initProps } from './componentProps'
import { PublicInstanceProxyHandlers } from './componentPublicInstance'

export function createComponentInstance(vnode, parent) {
  const instance = {
    vnode,
    parent,
    type: vnode.type,
    setupState: {},
    el: null,
    slots: {},
    provides: parent ? parent.provides : {},
    isMounted: false,
    emit: (_string, ..._args) => { },
  }
  
  instance.emit = emit.bind(null, instance)

  return instance
}

export function setupComponent(instance) {
  // TODO: initProps initSlots
  initProps(instance, instance.vnode.props)
  initSlots(instance, instance.vnode.children)
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance) {
  const { type, props, emit } = instance
  const Component = type
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers)
  const { setup } = Component

  if (setup) {
    setCurrentInstance(instance)
    const setupResult = setup(shallowReadonly(props), { emit })
    setCurrentInstance(null)

    handleSetupResult(instance, setupResult)
  }
}
let currentInstance = null
export function getCurrentInstance() {
  return currentInstance
};

function setCurrentInstance(instance) {
  currentInstance = instance
};

function handleSetupResult(instance: any, setupResult) {
  // TODO: function
  if (typeof setupResult === 'object')
    instance.setupState = proxyRefs(setupResult)

  finishComponentSetup(instance)
}

function finishComponentSetup(instance: any) {
  const Component = instance.type
  // if (Component?.render) {
  instance.render = Component.render
  // }
}
