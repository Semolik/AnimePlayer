import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import VueSnip from "vue-snip";
import VueMobileDetection from "vue-mobile-detection";

const app = createApp(App);
app.use(router).use(VueMobileDetection).use(VueSnip);
app.mount("#app");
