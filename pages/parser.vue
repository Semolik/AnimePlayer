<template>
    <div class="parser-page">
        <UBreadcrumb :links="links" v-if="parser" />
        <div
            v-else
            class="h-[24px] sm:w-[250px] w-full rounded-lg animate-pulse bg-cool-700"
        ></div>
        <div class="parser-name">
            <template v-if="parser">
                {{
                    parser.name +
                    (selectedGenre.id ? `: ${selectedGenre.name}` : "")
                }}
            </template>
            <div
                v-else
                class="h-[48px] w-[300px] rounded-lg animate-pulse bg-cool-700"
            ></div>
        </div>
        <div class="genres-container" v-auto-animate>
            <UButton
                block
                :size="$viewport.isLessThan('md') ? 'lg' : 'md'"
                class="md:w-min whitespace-nowrap"
                :label="
                    'Жанры' +
                    (selectedGenre.id ? ` (${selectedGenre.name})` : '')
                "
                trailing-icon="i-heroicons-chevron-down-20-solid"
                @click="genresMenuOpen = !genresMenuOpen"
            />

            <div class="genres" v-if="genresMenuOpen">
                <div
                    :class="[
                        'genre',
                        { selected: genre.id == selectedGenre.id },
                    ]"
                    v-for="genre in parserGenres"
                    :key="genre.id"
                    @click="selectedGenre = genre"
                >
                    {{ genre.name }}
                </div>
            </div>
        </div>
        <titles :titles="titlesData" />
        <div class="titles-empty" v-if="loaded && !titlesData.length">
            Ничего не найдено
        </div>
        <UButton
            block
            size="lg"
            :loading="!loaded"
            @click="fetchMore"
            v-if="!hideLoadMore"
        >
            Загрузить еще
        </UButton>
    </div>
</template>
<script setup>
import { ParsersService, GenresService } from "~/client";
const { parser_id, genre_id } = useRoute().query;

const parser = ref(parser_id ? getParser(parser_id) : null);
const parserGenres = ref([]);
const selectedGenre = ref({ id: null, name: "Все" });
const links = computed(() => {
    var arr = [{ label: "Главная", to: "/" }];
    if (parser.value) {
        arr.push({
            label: parser.value.name,
        });
    }
    if (selectedGenre.value.id) {
        arr.push({ label: selectedGenre.value.name });
    }
    return arr;
});
const placeholderTitles = Array.from({ length: 18 }, (_, i) => null);
const titlesData = ref(markRaw(placeholderTitles));
const page = ref(0);
const loaded = ref(false);
const hideLoadMore = ref(false);
const genresMenuOpen = ref(false);
const genresLoaded = ref(false);
const fetchMore = async () => {
    loaded.value = false;
    page.value++;
    var isMain = false;
    if (selectedGenre.value.id) {
        var newPage =
            await GenresService.getGenreTitlesApiV1GenresGenreIdTitlesGet(
                selectedGenre.value.id,
                page.value
            );
    } else if (page.value == 1) {
        var newPage =
            await ParsersService.getMainTitlesApiV1ParsersParserIdTitlesMainGet(
                parser.value.id
            );
        page.value = newPage.pages_on_main;
        isMain = true;
    } else {
        var newPage =
            await ParsersService.getTitlesApiV1ParsersParserIdTitlesGet(
                parser.value.id,
                page.value
            );
    }
    titlesData.value =
        page.value == 1 || isMain
            ? newPage.titles
            : [...titlesData.value, ...newPage.titles];
    if (newPage.total_pages <= page.value) {
        hideLoadMore.value = true;
    }

    loaded.value = true;
};
const router = useRouter();
watch(router.currentRoute, async (route, oldRoute) => {
    const { parser_id, genre_id } = route.query;
    let old_parser_id = oldRoute.query.parser_id || parser.value?.id;
    if (parser_id) {
        parser.value = getParser(parser_id);
        selectedGenre.value = { id: null, name: "Все" };
    }
    if (genre_id) {
        selectedGenre.value = await GenresService.getGenreApiV1GenresGenreIdGet(
            genre_id
        );
        parser.value = getParser(selectedGenre.value.parser_id);
    }
    if (old_parser_id != parser.value.id) {
        parserGenres.value =
            await ParsersService.getGenresApiV1ParsersParserIdGenresGet(
                parser.value.id
            );
    }
    page.value = 0;
    hideLoadMore.value = false;
    titlesData.value = markRaw(placeholderTitles);
    await fetchMore();
});
onMounted(async () => {
    if (!parser.value) {
        const genre = await GenresService.getGenreApiV1GenresGenreIdGet(
            genre_id
        );
        selectedGenre.value = genre;
        parser.value = getParser(genre.parser_id);
    }
    await fetchMore();
    genresLoaded.value = false;
    const genres = await ParsersService.getGenresApiV1ParsersParserIdGenresGet(
        parser.value.id
    );
    parserGenres.value = [{ id: null, name: "Все" }, ...genres];
    genresLoaded.value = true;
    watch(selectedGenre, async (genre) => {
        if (genre.id) {
            router.replace({ query: { genre_id: genre.id } });
        } else {
            router.replace({ query: { parser_id: parser.value.id } });
        }
    });
});
</script>
<style lang="scss">
.parser-page {
    display: flex;
    flex-direction: column;
    gap: 10px;
    .genres-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
        .genres {
            display: grid;
            gap: 10px;
            grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
            margin-bottom: 10px;
            gap: 8px;
            .genre {
                padding: 5px 10px;
                white-space: nowrap;
                background-color: $quinary-bg;
                border-radius: 5px;
                color: $secondary-text;
                text-align: center;
                cursor: pointer;
                @include md {
                    &:hover {
                        background-color: $senary-bg;
                        color: $primary-text;
                    }
                }

                &.selected {
                    background-color: $accent;
                    color: $primary-reverse-text;
                }
            }
        }
    }
    @include md(true) {
        padding: 10px;
    }
    .titles-empty {
        height: 50vh;
        @include flex-center;
        color: $secondary-text;
    }
    .parser-name {
        font-size: 2em;
        font-weight: 700;
    }
}
</style>
