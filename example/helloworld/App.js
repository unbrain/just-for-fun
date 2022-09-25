import { h } from "../../dist/fun-vue.esm.js";
export const App = {
  render() {
    return h("div", { name: 1 }, [
      h("h1", { class: "red" }, "h1"),
      h("h2", { class: "blue" }, "h2"),
    ]);
  },
  setup() {
    return {
      msg: "vue",
    };
  },
};
