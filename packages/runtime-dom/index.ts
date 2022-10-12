import { createRenderer } from "../runtime-core";

export function createElement(type) {
  return document.createElement(type);
}

export function patchProp(el, key, preVal, nextVal) {
  const isOn = /on[A-Z]/.test(key);
  if (isOn) {
    const event = key.slice(2).toLocaleLowerCase()
    el.addEventListener(event, nextVal);
  } else {
    if (nextVal === undefined || nextVal === null) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, nextVal);
    }
  }
}

export function insert(el, container) {
  container.appendChild(el);
}

function remove(child) {
  const parent = child.parentNode;
  if(parent) {
    parent.remove(child);
  }
}

function setElementText(el, text) {
  el.textContent = text;
}

const renderer: any = createRenderer({
  createElement,
  patchProp,
  insert,
  remove,
  setElementText
});

export function createApp(...args) {
  return renderer.createApp(...args);
}

export * from '../runtime-core';