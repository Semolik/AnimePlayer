import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import VueMobileDetection from "vue-mobile-detection";
import vWave from 'v-wave';
import { useThemeStore } from './stores/theme';


const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(VueMobileDetection);
app.use(vWave);
app.mount("#app");


const themeStore = useThemeStore();
const { initTheme } = themeStore;
initTheme();
