import { h } from "../../dist/fun-vue.esm.js";
import { Foo } from "./Foo.js";
window.$self = null;
export const App = {
  render() {
    console.log(this, this.$el);
    window.$self = this;
    return h("div", { name: 1 }, [
      h(
        "h1",
        {
          class: "red",
          onClick() {
            console.log("click h1");
          },
        },
        `h1, ${this.msg}`
      ),
      h(
        "h2",
        {
          class: "blue",
          onClick() {
            console.log("click h2");
          },
        },
        "h2"
      ),
      h(Foo, {count: 1}),
    ]);
  },
  setup() {
    return {
      msg: "vue",
    };
  },
};
