import { OpenAPI, ParsersService } from "@/client";
export default defineNuxtPlugin(async (nuxtApp) => {
    OpenAPI.BASE = import.meta.server ? "http://localhost:3000" : "";
    OpenAPI.WITH_CREDENTIALS = true;
    if (import.meta.server) {
        const counter = useCookie("fastapiusersauth");
        OpenAPI.HEADERS = {
            Cookie: `fastapiusersauth=${counter.value}`,
        };
    }
    const parsers = await ParsersService.getParsersApiV1ParsersGet();
    nuxtApp.provide("parsers", parsers);
});
