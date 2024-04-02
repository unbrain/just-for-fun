import { getCurrentInstance, h, renderSlots } from '../../dist/fun-vue.esm.js'

export const Foo = {
  render() {
    const age = 25
    // const btn = h(
    //   "button",
    //   {
    //     onClick: this.emitTest,
    //   },
    //   "emitTest"
    // );
    const foo = h('div', { name: 1 }, `foo ${this.count}`)
    const app = [
      renderSlots(this.$slots, 'header', { age }),
      // btn,
      foo,
      renderSlots(this.$slots, 'footer'),
    ]
    return h('div', {}, app)
  },
  setup(props, { emit }) {
    const instance = getCurrentInstance()
    console.log(instance, 'foo')
    const emitTest = () => {
      emit('add', 1, 2)
      emit('add-one', 3, 4)
    }
    return {
      count: 1,
      emitTest,
    }
  },
}
