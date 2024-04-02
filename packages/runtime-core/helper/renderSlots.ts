import { Fragment, createVNode } from '../vnode'

export function renderSlots(slots, name: string, props = {}) {
  const slot = slots[name]
  if (slot)
    return createVNode(Fragment, {}, slot(props))
}
