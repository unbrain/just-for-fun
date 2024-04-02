import {
  createTextVNode,
  getCurrentInstance,
  h,
} from '../../dist/fun-vue.esm.js'
import { Foo } from './Foo.js'

window.$self = null
export const App = {
  render() {
    // console.log(this, this.$el, this.$slots, '9090');
    window.$self = this
    const foo = h(
      Foo,
      {},
      {
        header: ({ age }) => [
          h('p', {}, 'header'),
          createTextVNode('hello, header'),
        ],
        footer: () => h('p', {}, 'footer'),
      },
    )
    return h('div', { name: 1 }, [
      createTextVNode('hello'),
      foo,
      // h(
      //   "h1",
      //   {
      //     class: "red",
      //     onClick() {
      //       console.log("click h1");
      //     },
      //   },
      //   `h1, ${this.msg}`
      // ),
      // h(
      //   "h2",
      //   {
      //     class: "blue",
      //     onClick() {
      //       console.log("click h2");
      //     },
      //   },
      //   "h2"
      // ),
      // h(Foo, {
      //   count: 1,
      //   onAdd: (A, B) => {
      //     console.log("on add", A, B);
      //   },
      //   onAddOne: (A, B) => {
      //     console.log("on add one", A, B);
      //   },
      // }),
    ])
  },
  setup() {
    const instance = getCurrentInstance()
    console.log(instance, 'app')
    return {
      msg: 'vue',
    }
  },
}
