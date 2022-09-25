import { isObject, isString } from "../shared";
import { createComponentInstance, setupComponent } from "./components";

export function render(vnode, container) {
  patch(vnode, container);
}

function patch(vnode, container) {
  // TODO: vnode is ele
  console.log(vnode.type);
  if (isString(vnode.type)) {
    processElement(vnode, container);
  } else if (isObject(vnode.type)) {
    processComponent(vnode, container);
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
  const el = document.createElement(type);
  for (const key in props) {
    el.setAttribute(key, props[key]);
  }
  if (isString(children)) {
    el.textContent = children;
  } else if(isObject(children)) {
    mountChildren(vnode, el);
  }
  container.appendChild(el);
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
  const subTree = instance.render();
  // vnode -> patch 
  // vnode -> ele -> mountEle
  patch(subTree, container)
}


