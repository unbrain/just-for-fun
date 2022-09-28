import { h } from "../../dist/fun-vue.esm.js";
export const Foo = {
  render() {
    return h("div", { name: 1 }, `foo ${this.count}`);
  },
  setup(props) {
    console.log(props, 'props');
  },
};
