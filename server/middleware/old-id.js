import { ParsersService, OpenAPI } from "~/client";
var parsers = [];
OpenAPI.BASE = useRuntimeConfig().apiLocalUrl;
ParsersService.getParsersApiV1ParsersGet().then((data) => {
    parsers = data;
});
export default defineEventHandler(async (event) => {
    const parts = event.path.split("/");
    if (parts.length > 2 && parsers.find((parser) => parser.id === parts[1])) {
        const title_id =
            await ParsersService.resolveOldIdApiV1ParsersParserIdResolveOldIdTitleIdGet(
                parts[1],
                parts[2].split("~")[1].split("-")[0]
            );
        return sendRedirect(event, `/titles/${title_id}`, 301);
    }
});
