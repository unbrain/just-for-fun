import { effect } from "../reactivity/effect";
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

  /**
   * 
   * @param n1 老节点
   * @param n2 新节点
   * @param container 
   * @param parent 
   */
  function patch(n1, n2, container, parent?) {
    // TODO: vnode is ele
    const { shapeFlag, type } = n2;
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parent);
        break;
      case Text:
        processText(n1, n2, container);
        break;
      default:

        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parent);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parent);
        }
    }
  }

  function processElement(n1, n2: any, container: any, parent) {
    if (!n1) {
      mountElement(n2, container, parent);
    } else {
      patchElement(n1, n2, container, parent);
    }
  }

  function patchElement(n1, n2, container, parent) {
    console.log(n1, n2);
  }

  function processComponent(n1, n2: any, container: any, parent) {
    mountComponent(n2, container, parent)
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


  function processText(n1, n2: any, container: any) {
    const { children } = n2;
    const textNode = (n2.el = document.createTextNode(children));
    container.append(textNode);
  }

  function processFragment(n1, n2: any, container: any, parent) {
    mountChildren(n2, container, parent)
  }

  function mountChildren(vnode, container, parent) {
    for (const key in vnode.children) {
      patch(null, vnode.children[key], container, parent);
    }
  }

  function mountComponent(vnode: any, container, parent) {
    const instance = createComponentInstance(vnode, parent)
    setupComponent(instance);
    setupRenderEffect(instance, container)
  }

  function setupRenderEffect(instance: any, container) {
    effect(() => {
      if (!instance.isMounted) {
        const { proxy } = instance;
        const subTree = (instance.subTree = instance.render.call(proxy));
        // vnode -> patch 
        // vnode -> ele -> mountEle
        patch(null, subTree, container, instance)

        instance.vnode.el = subTree.el;
        instance.isMounted = true;
      } else {
        console.log('update')

        const { proxy } = instance;
        const subTree = instance.render.call(proxy);
        const prevSubTree = instance.subTree;
        instance.subTree = subTree;
        // vnode -> patch 
        // vnode -> ele -> mountEle
        patch(prevSubTree, subTree, container, instance)
      }
    })
  }

  return {
    createApp: createAppAPI(render)
  }
}



