import { OpenAPI, ParsersService } from "@/client";
export default defineNuxtPlugin(async (nuxtApp) => {
    const runtimeConfig = useRuntimeConfig();
    OpenAPI.BASE = import.meta.server
        ? runtimeConfig.apiLocalUrl
        : runtimeConfig.public.apiUrl;
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
