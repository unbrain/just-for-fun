import { h, ref } from '../../dist/fun-vue.esm.js'

export const App = {
  name: 'App',
  setup() {
    const count = ref(0)
    const onClick = () => {
      count.value++
      console.log(1, count.value)
    }

    const props = ref({
      foo: 'foo',
      bar: 'bar',
    })

    const change1 = () => {
      props.value.foo = 'new-foo'
    }

    const change2 = () => {
      props.value.foo = undefined
    }

    const change = () => {
      props.value = {
        foo: 'foo',
      }
    }

    return {
      count,
      props,
      change1,
      change2,
      change,
    }
  },
  render() {
    return h(
      'div',
      {
        id: 'root',
        ...this.props,
      },
      [
        h('div', {}, `count: ${this.count}`),
        h('button', { onClick: this.change1 }, 'change1'),
        h('button', { onClick: this.change2 }, 'change2'),
        h('button', { onClick: this.change }, 'change'),
      ],
    )
  },
}
