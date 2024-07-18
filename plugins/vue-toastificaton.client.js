import { defineNuxtPlugin } from "#app";
import * as vt from "vue-toastification";
import "vue-toastification/dist/index.css";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(vt.default);
    return {
        provide: {
            toast: vt.useToast(),
        },
    };
});
