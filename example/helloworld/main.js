import { createApp } from "../../dist/fun-vue.esm.js";
import { App } from "./Provider.js";
const rootContainer = document.querySelector("#app");
createApp(App).mount(rootContainer);
