import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import VueSnip from "vue-snip";


const app = createApp(App);
app.use(router).use(VueSnip);
app.mount("#app");
