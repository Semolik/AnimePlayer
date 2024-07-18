import { OpenAPI } from "@/client";
export default defineNuxtPlugin((nuxtApp) => {
    OpenAPI.BASE = import.meta.server ? "http://localhost:3000/api" : "/api";
    OpenAPI.WITH_CREDENTIALS = true;
});
