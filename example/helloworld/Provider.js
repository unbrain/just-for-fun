import { h, inject, provide } from '../../dist/fun-vue.esm.js'

const Provider = {
  name: 'Provider',
  setup() {
    provide('a', 1)
  },
  render() {
    return h('div', {}, [h('div', {}, 'provider'), h(Consumer)])
  },
}

const Consumer = {
  name: 'consumer',
  setup() {
    provide('a', 2)
    const b = inject('b', () => 'default')
    const a = inject('a')

    return {
      a,
      b,
    }
  },
  render() {
    return h('div', {}, [h('div', {}, `consumer: a : ${this.a}, b: ${this.b}`), h(children)])
  },
}

const children = {
  name: 'child',
  setup() {
    const a = inject('a')
    return { a }
  },
  render() {
    return h('div', {}, `child: a : ${this.a}`)
  },
}

export const App = {
  name: 'app',
  setup() {},
  render() {
    return h('div', {}, [h(Provider)])
  },
}
