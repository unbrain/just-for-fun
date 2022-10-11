import { h, ref } from "../../dist/fun-vue.esm.js";

export const App = {
  setup() {
    const count = ref(0);
    const onClick = () => {
      count.value += 1;
    };

    const props = ref({
      foo: 'foo',
      bar: 'bar'
    })

    const onClick1 = () => {
      console.log(1111111111111);
      props.value.foo = 'new-foo';
    }

    const onClick2 = () => {
      props.value.foo = undefined;
    }

    const onClick3 = () => {
      props.value = {
        foo: 'foo'
      }
    }

    return {
      count,
      onClick,
      props,
      onClick1,
      onClick2,
      onClick3
    };
  },
  render() {
    return h("div", {...this.props}, [
      h("div", {}, `count: ${this.count}`),
      h("button", { onClick: this.onClick }, "plus"),
      h("button", { onClick: this.onClick1 }, "change props"),
      h("button", { onClick: this.onClick2 }, "undefined"),
      h("button", { onClick: this.onClick3 }, "null"),
    ]);
  },
};
