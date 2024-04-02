import { isObject, isString } from "../shared";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./components";
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";


export function createRenderer(options) {
  const { createElement, patchProps, insert } = options;
  function render(vnode, container) {
    patch(vnode, container);
  }
  
  function patch(vnode, container, parent?) {
    // TODO: vnode is ele
    const { shapeFlag, type } = vnode;
    switch (type) {
      case Fragment:
        processFragment(vnode, container, parent);
        break;
      case Text:
        processText(vnode, container);
        break;
      default:

        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(vnode, container, parent);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(vnode, container, parent);
        }
    }
  }

  function processElement(vnode: any, container: any, parent) {
    mountElement(vnode, container, parent);
  }

  function processComponent(vnode: any, container: any, parent) {
    mountComponent(vnode, container, parent)
  }

  function mountElement(vnode: any, container: any, parent) {
    const { props, type, children } = vnode;
    // const el = (vnode.el = document.createElement(type)) as HTMLElement;
    const el = (vnode.el = createElement(type)) as HTMLElement;
    for (const key in props) {
      const val = props[key];
      patchProps(el, key, val);
      // const isOn = /on[A-Z]/.test(key);
      // if (isOn) {
      //   const event = key.slice(2).toLocaleLowerCase()
      //   el.addEventListener(event, props[key]);
      // } else {
      //   el.setAttribute(key, props[key]);
      // }
    }
    const { shapeFlag } = vnode;
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode, el, parent);
    }
    // container.appendChild(el);
    insert(el, container);
  }


  function processText(vnode: any, container: any) {
    const { children } = vnode;
    const textNode = (vnode.el = document.createTextNode(children));
    container.append(textNode);
  }

  function processFragment(vnode: any, container: any, parent) {
    mountChildren(vnode, container, parent)
  }

  function mountChildren(vnode, container, parent) {
    for (const key in vnode.children) {
      patch(vnode.children[key], container, parent);
    }
  }

  function mountComponent(vnode: any, container, parent) {
    const instance = createComponentInstance(vnode, parent)
    setupComponent(instance);
    setupRenderEffect(instance, container)
  }

  function setupRenderEffect(instance: any, container) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    // vnode -> patch 
    // vnode -> ele -> mountEle
    patch(subTree, container, instance)

    instance.vnode.el = subTree.el;
  }

  return {
    createApp: createAppAPI(render)
  }
}



