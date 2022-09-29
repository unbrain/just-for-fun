import { h } from "../../dist/fun-vue.esm.js";
export const Foo = {
  render() {
    const btn = h('button', {
      onClick: this.emitTest
    }, 'emitTest')
    const foo = h("div", { name: 1 }, `foo ${this.count}`);
    return h("div", {  }, [btn, foo]);
  },
  setup(props, {emit}) {
    console.log(props, 'props');
    const emitTest = () => {
      console.log('emit test');
      emit('add', 1, 2);
      emit('add-one', 3, 4);
    }
    return {
      emitTest,
    }
  },
};
