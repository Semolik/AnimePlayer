import { OpenAPI, ParsersService } from "@/client";
export default defineNuxtPlugin(async (nuxtApp) => {
    OpenAPI.BASE = import.meta.server ? "http://localhost:3000" : "";
    OpenAPI.WITH_CREDENTIALS = true;
    const parsers = await ParsersService.getParsersApiV1ParsersGet();
    nuxtApp.provide("parsers", parsers);
});
