import { isObject, isString } from "../shared";
import { ShapeFlags } from '../shared/ShapeFlags'

const getShapeFlags = (type) => {
  return isString(type) ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT;
}

export function createVNode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
    shapeFlag: getShapeFlags(type)
  }

  if(isString(children)) {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
  } else if (isObject(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
  }

  return vnode;
}