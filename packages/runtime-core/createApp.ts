import { render } from "./render";
import { createVNode } from "./vnode"



export function createApp (rootComponent) {
  return {
    mount(rootContainer) {
      // 先转换为 vnode 
      // 
      const vnode = createVNode(rootComponent)

      render(vnode, rootContainer);
    }
  }
}