import { createRenderer } from "../runtime-core";

export function createElement(type) {
  return document.createElement(type);
}

export function patchProps(el, key, val) {
  const isOn = /on[A-Z]/.test(key);
  if (isOn) {
    const event = key.slice(2).toLocaleLowerCase()
    el.addEventListener(event, val);
  } else {
    el.setAttribute(key, val);
  }
}

export function insert(el, container) {
  container.appendChild(el);
}

const renderer: any = createRenderer({
  createElement,
  patchProps,
  insert,
});

export function createApp(...args) {
  return renderer.createApp(...args);
}

export * from '../runtime-core';