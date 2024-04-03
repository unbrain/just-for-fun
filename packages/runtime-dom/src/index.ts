import { createRenderer } from '@zy/runtime-core'

export function createElement(type) {
  return document.createElement(type)
}

export function patchProps(el, key, _val, nextVal) {
  const isOn = /on[A-Z]/.test(key)
  if (isOn) {
    const event = key.slice(2).toLocaleLowerCase()
    el.addEventListener(event, nextVal)
  }
  else {
    if (nextVal === null || nextVal === undefined)
      el.removeAttribute(key)
    else
      el.setAttribute(key, nextVal)
  }
}

export function insert(el, container) {
  container.appendChild(el)
}

const renderer: any = createRenderer({
  createElement,
  patchProps,
  insert,
})

export function createApp(...args) {
  return renderer.createApp(...args)
}

export * from '@zy/runtime-core'
