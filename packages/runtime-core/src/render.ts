import { effect } from '@zy/reactivity'
import { EMPTY_OBJ, ShapeFlags } from '@zy/shared'
import { createComponentInstance, setupComponent } from './components'
import { createAppAPI } from './createApp'
import { Fragment, Text } from './vnode'

export function createRenderer(options) {
  const { createElement: hostCreateElement, patchProps: hostPatchProps, insert: hostInsert, remove: hostRemove, setElementText: hostSetElementText } = options
  function render(vnode, container) {
    patch(null, vnode, container, null, null)
  }

  /**
   *
   * @param n1 老节点
   * @param n2 新节点
   * @param container
   * @param parent
   */
  function patch(n1, n2, container, parent?, anchor?) {
    // TODO: vnode is ele
    const { shapeFlag, type } = n2
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parent, anchor)
        break
      case Text:
        processText(n1, n2, container)
        break
      default:

        if (shapeFlag & ShapeFlags.ELEMENT)
          processElement(n1, n2, container, parent, anchor)
        else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT)
          processComponent(n1, n2, container, parent, anchor)
    }
  }

  function processElement(n1, n2: any, container: any, parent, parentAnchor) {
    if (!n1)
      mountElement(n2, container, parent, parentAnchor)
    else
      patchElement(n1, n2, parent, parentAnchor)
  }
  function patchElement(n1, n2, parentComponent, parentAnchor) {
    // eslint-disable-next-line no-console
    console.log(n1, n2)
    const oldProps = n1.props || EMPTY_OBJ
    const newProps = n2.props || EMPTY_OBJ

    const el = (n2.el = n1.el)

    patchChildren(n1, n2, el, parentComponent, parentAnchor)
    patchProps(el, oldProps, newProps)
  }

  function patchChildren(n1: any, n2: any, container, parentComponent, parentAnchor) {
    const prevShapeFlag = n1.shapeFlag
    const c1 = n1.children
    const c2 = n2.children
    const shapeFlag = n2.shapeFlag
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // clear children
        unmountChildren(c1)
        // set text
        hostSetElementText(container, c2)
      }
      else if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        if (c1 !== c2)
          hostSetElementText(container, c2)
      }
    }
    else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, '')
        mountChildren(c2, container, parentComponent, parentAnchor)
      }
      else if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        patchKeyedChildren(c1, c2, container, parentComponent, parentAnchor)
        // unmountChildren(c1)
        // mountChildren(c2, container, parentComponent)
      }
    }
  }

  function patchKeyedChildren(c1, c2, container, parentComponent, parentAnchor) {
    const len1 = c1.length
    const len2 = c2.length
    let point = 0

    function isSameVnode(n1, n2) {
      return n1.type === n2.type && n1.key === n2.key
    }
    while (point < len1 && point < len2) {
      const n1 = c1[point]
      const n2 = c2[point]

      if (isSameVnode(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor)
        point++
      }
      else {
        break
      }
    }

    let e1 = len1 - 1; let e2 = len2 - 1
    while (e1 >= point && e2 >= point) {
      const n1 = c1[e1]
      const n2 = c2[e2]

      if (isSameVnode(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor)
        e1--
        e2--
      }
      else {
        break
      }
    }
    if (point > e1 && point <= e2) {
      const nextPos = e2 + 1
      const anchor = nextPos < len2 ? c2[nextPos].el : null

      while (point <= e2) {
        patch(null, c2[point], container, parentComponent, anchor)
        point++
      }
    }
    else if (point <= e1 && point > e2) {
      console.log('in')
      while (point <= e1) {
        hostRemove(c1[point].el)
        point++
      }
    }
    console.log(point, e1, e2)
  }

  function unmountChildren(children) {
    for (let i = 0; i < children.length; i++) {
      const el = children[i].el
      hostRemove(el)
    }
  }

  function patchProps(el, oldProps, newProps) {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const prevProp = oldProps[key]
        const nextProp = newProps[key]
        if (prevProp !== nextProp)
          hostPatchProps(el, key, prevProp, nextProp)
      }
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!(key in newProps))
            hostPatchProps(el, key, oldProps[key], null)
        }
      }
    }
  }

  function processComponent(_n1, n2: any, container: any, parent, anchor) {
    mountComponent(n2, container, parent, anchor)
  }

  function mountElement(vnode: any, container: any, parent, anchor) {
    const { props, type, children } = vnode
    // const el = (vnode.el = document.createElement(type)) as HTMLElement;
    const el = (vnode.el = hostCreateElement(type)) as HTMLElement
    for (const key in props) {
      const val = props[key]
      hostPatchProps(el, key, null, val)
    }
    const { shapeFlag } = vnode
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN)
      el.textContent = children
    else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN)
      mountChildren(vnode.children, el, parent, anchor)

    // container.appendChild(el);
    hostInsert(el, container, anchor)
  }

  function processText(_n1, n2: any, container: any) {
    const { children } = n2
    const textNode = (n2.el = document.createTextNode(children))
    container.append(textNode)
  }

  function processFragment(_n1, n2: any, container: any, parent, anchor) {
    mountChildren(n2.children, container, parent, anchor)
  }

  function mountChildren(children, container, parent, anchor) {
    for (const key in children)
      patch(null, children[key], container, parent, anchor)
  }

  function mountComponent(vnode: any, container, parent, anchor) {
    const instance = createComponentInstance(vnode, parent)
    setupComponent(instance)
    setupRenderEffect(instance, container, anchor)
  }

  function setupRenderEffect(instance: any, container, anchor) {
    effect(() => {
      if (!instance.isMounted) {
        const { proxy } = instance
        const subTree = (instance.subTree = instance.render.call(proxy))
        // vnode -> patch
        // vnode -> ele -> mountEle
        patch(null, subTree, container, instance, anchor)

        instance.vnode.el = subTree.el
        instance.isMounted = true
      }
      else {
        const { proxy } = instance
        const subTree = instance.render.call(proxy)
        const prevSubTree = instance.subTree
        instance.subTree = subTree
        // vnode -> patch
        // vnode -> ele -> mountEle
        patch(prevSubTree, subTree, container, instance, anchor)
      }
    })
  }

  return {
    createApp: createAppAPI(render),
  }
}
