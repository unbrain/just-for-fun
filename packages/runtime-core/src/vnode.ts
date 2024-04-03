import { ShapeFlags, isObject, isString } from '@zy/shared'

export const Fragment = Symbol('Fragment')
export const Text = Symbol('Text')
function getShapeFlags(type) {
  return isString(type) ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT
}

export function createVNode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
    el: null,
    shapeFlag: getShapeFlags(type),
  }

  if (isString(children))
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
  else if (isObject(children))
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN

  if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT && isObject(children))
    vnode.shapeFlag |= ShapeFlags.SLOTS_CHILDREN

  return vnode
}

export function createTextVNode(text: string) {
  return createVNode(Text, {}, text)
}
