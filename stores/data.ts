import { defineStore } from "pinia";
import {
    GenresService,
    ParsersService,
    type ParserInfo,
    type UniqueGenre,
} from "@/client";
export const useAppDataStore = defineStore({
    id: "app-data",
    state: () => ({
        parsers: [] as ParserInfo[],
        genres: [] as UniqueGenre[],
    }),
    actions: {
        async getParsers(): Promise<void> {
            this.parsers = await ParsersService.getParsersApiV1ParsersGet();
        },
        async getGenres(): Promise<void> {
            this.genres = await GenresService.getGenresApiV1GenresGenresGet();
        },
        async fetchData(): Promise<void> {
            await this.getParsers();
            await this.getGenres();
        },
    },
});
