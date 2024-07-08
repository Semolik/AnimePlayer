import { OpenAPI } from "@/client";
export default defineNuxtPlugin((nuxtApp) => {
    OpenAPI.BASE = "http://localhost:8000";
    OpenAPI.WITH_CREDENTIALS = true;
});
