import { effect } from "../reactivity";
import { isObject, isString } from "../shared";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./components";
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";


export function createRenderer(options) {
  const { createElement, patchProps, insert } = options;
  function render(vnode, container) {
    patch(null, vnode, container);
  }

  function patch(newVNode, vnode, container, parent?) {
    // TODO: vnode is ele
    const { shapeFlag, type } = vnode;
    switch (type) {
      case Fragment:
        processFragment(newVNode, vnode, container, parent);
        break;
      case Text:
        processText(newVNode, vnode, container);
        break;
      default:

        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(newVNode, vnode, container, parent);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(newVNode, vnode, container, parent);
        }
    }
  }

  function processElement(newVNode, vnode: any, container: any, parent) {
    mountElement(newVNode, vnode, container, parent);
  }

  function processComponent(newVNode, vnode: any, container: any, parent) {
    mountComponent(processComponent, vnode, container, parent)
  }

  function mountElement(newVNode, vnode: any, container: any, parent) {
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
      mountChildren(newVNode, vnode, el, parent);
    }
    // container.appendChild(el);
    insert(el, container);
  }


  function processText(newVNode, vnode: any, container: any) {
    const { children } = vnode;
    const textNode = (vnode.el = document.createTextNode(children));
    container.append(textNode);
  }

  function processFragment(newVNode, vnode: any, container: any, parent) {
    mountChildren(newVNode, vnode, container, parent)
  }

  function mountChildren(newVNode, vnode, container, parent) {
    for (const key in vnode.children) {
      patch(newVNode, vnode.children[key], container, parent);
    }
  }

  function mountComponent(processComponent, vnode: any, container, parent) {
    const instance = createComponentInstance(vnode, parent)
    setupComponent(instance);
    setupRenderEffect(instance, container)
  }

  function setupRenderEffect(instance: any, container) {
    const { proxy, subTree } = instance;
    effect(() => {
      if(!instance.isMounted) {
        const subTree = (instance.subTree = instance.render.call(proxy));
        // vnode -> patch 
        // vnode -> ele -> mountEle
        patch(null, subTree, container, instance)
        instance.vnode.el = subTree.el;
        instance.isMounted = true;
      } else {
        console.log('update');
        const subTree = instance.render.call(proxy); 
        console.log(subTree, instance.subTree);
        instance.subTree = subTree;
      }
    })
  }

  return {
    createApp: createAppAPI(render)
  }
}



