import { isObject, isString } from "../shared";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./components";
import { Fragment } from "./vnode";

export function render(vnode, container) {
  patch(vnode, container);
}

function patch(vnode, container) {
  // TODO: vnode is ele
  const { shapeFlag, type } = vnode;
  switch (type) {
    case Fragment:
      processFragment(vnode, container);
      break;
    case Text:
      processText(vnode, container);
      break;
    default:

      if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container);
      } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container);
      }
  }
}

function processElement(vnode: any, container: any) {
  mountElement(vnode, container);
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container)
}

function mountElement(vnode: any, container: any) {
  const { props, type, children } = vnode;
  const el = (vnode.el = document.createElement(type)) as HTMLElement;
  for (const key in props) {
    const isOn = /on[A-Z]/.test(key);
    if (isOn) {
      const event = key.slice(2).toLocaleLowerCase()
      el.addEventListener(event, props[key]);
    } else {
      el.setAttribute(key, props[key]);
    }
  }
  const { shapeFlag } = vnode;
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el);
  }
  container.appendChild(el);
}


function processText(vnode: any, container: any) {
  const { children } = vnode;
  const textNode = (vnode.el = document.createTextNode(children));
  container.append(textNode);
}

function processFragment(vnode: any, container: any) {
  mountChildren(vnode, container)
}

function mountChildren(vnode, container) {
  for (const key in vnode.children) {
    patch(vnode.children[key], container);
  }
}

function mountComponent(vnode: any, container) {
  const instance = createComponentInstance(vnode)
  setupComponent(instance);
  setupRenderEffect(instance, container)
}

function setupRenderEffect(instance: any, container) {
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);
  // vnode -> patch 
  // vnode -> ele -> mountEle
  patch(subTree, container)

  instance.vnode.el = subTree.el;
}


