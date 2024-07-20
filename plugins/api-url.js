import { OpenAPI } from "@/client";
export default defineNuxtPlugin((nuxtApp) => {
    OpenAPI.BASE = import.meta.server ? "http://localhost:3000" : "";
    OpenAPI.WITH_CREDENTIALS = true;
});
