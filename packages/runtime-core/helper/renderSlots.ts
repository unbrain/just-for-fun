import { Fragment, createVNode } from '../src/vnode'

export function renderSlots(slots, name: string, props = {}) {
  const slot = slots[name]
  if (slot)
    return createVNode(Fragment, {}, slot(props))
  return null
}
