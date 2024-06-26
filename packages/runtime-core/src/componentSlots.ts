import { ShapeFlags } from '@zy/shared'

export function initSlots(instance, children) {
  const { vnode, slots } = instance
  if (vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN)
    normalizeObjectSlots(children, slots)
}

function normalizeObjectSlots(children, slots) {
  for (const key in children) {
    const value = children[key]
    if (typeof value === 'function')
      slots[key] = props => normalizeSlotValue(value(props))
  }
}

function normalizeSlotValue(value) {
  return Array.isArray(value) ? value : [value]
}
