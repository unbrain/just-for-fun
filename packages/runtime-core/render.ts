import { effect } from "../reactivity";
import { isObject, isString } from "../shared";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./components";
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";


export function createRenderer(options) {
  const { createElement: hostCreateElement, remove: hostRemove, setElementText: hostSetElementText, patchProp: hostPatchProp, insert: hostInsert } = options;
  function render(vnode, container) {
    patch(null, vnode, container);
  }

  function patch(newVNode, vnode, container, parent?) {
    // TODO: vnode is ele
    const { shapeFlag, type } = vnode;
    console.log(newVNode, vnode);
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
    if (newVNode) {
      patchElement(newVNode, vnode, container, parent);
    } else {
      mountElement(newVNode, vnode, container, parent);
    }
  }

  function patchElement(newVNode, vnode, container, parent) {
    console.log('patchElement');
    const EXNULL = {}
    const oldProps = newVNode.props || EXNULL;
    const newProps = vnode.props || EXNULL;


    const el = (vnode.el = newVNode.el);

    patchChild(newVNode, vnode, container)
    patchProps(el, oldProps, newProps);
  }

  function patchChild(n1, n2, container) {
    const preShapeFlag = n1.shapeFlag;
    const { shapeFlag } = n2;

    const c1 = n1.children
    const c2 = n2.children
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (preShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(n1.children);
      } 
      if (c1 !== c2) {
        hostSetElementText(container, c2)
      }
    } else {
      if(preShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, "")
        mountChildren(c2, container, parent);
      }
    }
  }

  function unmountChildren(children) {
    for (let i = 0; i < children.length; i++) {
      const el = children[i].el;
      hostRemove(el);
    }
  }

  function patchProps(el, oldProps, newProps) {
    const preProps = oldProps
    for (const key in newProps) {
      const preProp = oldProps[key];
      const nextProp = newProps[key];
      if (preProp !== nextProp) {
        hostPatchProp(el, key, preProp, nextProp);
      }
    }
  }

  function processComponent(newVNode, vnode: any, container: any, parent) {
    mountComponent(processComponent, vnode, container, parent)
  }

  function mountElement(newVNode, vnode: any, container: any, parent) {
    const { props, type, children } = vnode;
    // const el = (vnode.el = document.hostCreateElement(type)) as HTMLElement;
    const el = (vnode.el = hostCreateElement(type)) as HTMLElement;
    for (const key in props) {
      const val = props[key];
      hostPatchProp(el, key, null, val);
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
      mountChildren(vnode.children, el, parent);
    }
    // container.appendChild(el);
    hostInsert(el, container);
  }


  function processText(newVNode, vnode: any, container: any) {
    const { children } = vnode;
    const textNode = (vnode.el = document.createTextNode(children));
    container.append(textNode);
  }

  function processFragment(newVNode, vnode: any, container: any, parent) {
    mountChildren(vnode.children, container, parent)
  }

  function mountChildren(children, container, parent) {
    for (const key in children) {
      patch(null, children[key], container, parent);
    }
  }

  function mountComponent(processComponent, vnode: any, container, parent) {
    const instance = createComponentInstance(vnode, parent)
    setupComponent(instance);
    setupRenderEffect(instance, container)
  }

  function setupRenderEffect(instance: any, container) {
    effect(() => {
      const { proxy, subTree } = instance;
      if (!instance.isMounted) {
        const subTree = (instance.subTree = instance.render.call(proxy));
        // vnode -> patch 
        // vnode -> ele -> mountEle
        patch(null, subTree, container, instance)
        instance.vnode.el = subTree.el;
        instance.isMounted = true;
      } else {
        console.log('update');
        const subTree = instance.render.call(proxy);
        const pre = instance.subTree;
        instance.subTree = subTree;
        patch(pre, subTree, container, instance)
      }
    })
  }

  return {
    createApp: createAppAPI(render)
  }
}



