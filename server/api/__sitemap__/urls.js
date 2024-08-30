import { ParsersService } from "~/client";
export default defineSitemapEventHandler(async () => {
    const parsers = await ParsersService.getParsersApiV1ParsersGet();
    var titles = [];
    for (const parser of parsers) {
        const main_titles =
            await ParsersService.getMainTitlesApiV1ParsersParserIdTitlesMainGet(
                // @ts-ignore
                parser.id
            );
        titles = [...titles, ...main_titles.titles];
    }
    return [
        ...titles.map((t) =>
            asSitemapUrl({
                loc: "/titles/" + t.id,
            })
        ),
    ];
});
