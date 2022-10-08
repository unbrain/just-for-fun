import { h, ref } from "../../dist/fun-vue.esm.js";

export const App = {
  setup() {
    const count = ref(0);
    const onClick = () => {
      count.value += 1;
    };

    return {
      count,
      onClick,
    };
  },
  render() {
    return h("div", {}, [
      h("div", {}, `count: ${this.count}`),
      h("button", { onClick: this.onClick }, "plus"),
    ]);
  },
};
