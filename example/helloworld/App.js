import { h } from "../../dist/fun-vue.esm.js";
window.$self = null;
export const App = {
  render() {
    console.log(this, this.$el);
    window.$self = this;
    return h("div", { name: 1 }, [
      h("h1", { class: "red" }, `h1, ${this.msg}`),
      h("h2", { class: "blue" }, "h2"),
    ]);
  },
  setup() {
    return {
      msg: "vue",
    };
  },
};
