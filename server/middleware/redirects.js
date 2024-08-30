import { ParsersService, OpenAPI } from "~/client";
var parsers = [];
OpenAPI.BASE = useRuntimeConfig().apiLocalUrl;
ParsersService.getParsersApiV1ParsersGet().then((data) => {
    parsers = data;
});
export default defineEventHandler(async (event) => {
    const parts = event.path.split("/");
    if (parts.length > 2 && parsers.find((parser) => parser.id === parts[1])) {
        try {
            if (parts[2] === "genre") {
                if (parts.length > 3) {
                    if (!isNaN(parts[3])) {
                        throw new Error("year is not supported");
                    }
                    const genre_id =
                        await ParsersService.resolveOldIdApiV1ParsersParserIdResolveOldGenreGet(
                            parts[1],
                            parts[3]
                        );
                    return sendRedirect(
                        event,
                        `/parser?genre_id=${genre_id}`,
                        301
                    );
                }
            } else {
                const id = !isNaN(parts[2])
                    ? parts[2]
                    : parts[2].split("~")[1].split("-")[0];
                const title_id =
                    await ParsersService.resolveOldIdApiV1ParsersParserIdResolveOldIdTitleIdGet(
                        parts[1],
                        id
                    );
                return sendRedirect(event, `/titles/${title_id}`, 301);
            }
        } catch (e) {
            return sendRedirect(event, `/parser?parser_id=${parts[1]}`);
        }
    }
});
