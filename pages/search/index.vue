<template>
    <div class="search-page">
        <FormInput v-model="name" placeholder="Введите название" />
        <div class="sections">
            <section>
                <div class="headline">Жанры</div>
                <div class="genres">
                    <UButton
                        color="primary"
                        variant="outline"
                        class="genre"
                        v-for="genre in genres"
                        @click="goToGenre(genre)"
                    >
                        {{ genre.name }}
                    </UButton>
                </div>
            </section>
        </div>
    </div>
    <modal-dialog
        :active="modalActive"
        @update:active="selectParserActive = $event"
        headline="Выберите парсер"
    >
        <div class="flex mt-3 gap-2 flex-wrap">
            <UButton
                color="primary"
                variant="outline"
                size="lg"
                class="text-base grow flex justify-center"
                v-for="genre in aviableParsers"
                @click="
                    router.push({
                        name: 'parser',
                        query: {
                            genre_id: genre.id,
                        },
                    })
                "
            >
                {{ genre.name }}
            </UButton>
        </div>
    </modal-dialog>
</template>
<script setup>
import { GenresService } from "~/client";
const name = ref("");
const genres = await GenresService.getGenresApiV1GenresGenresGet();
const selectParserActive = ref(false);
const selectedGenre = ref(null);
const modalActive = computed(
    () => selectedGenre.value !== null && selectParserActive.value
);
const aviableParsers = computed(
    () =>
        modalActive.value &&
        selectedGenre.value.variants.map((genre) => ({
            ...genre,
            name: getParser(genre.parser_id).name,
        }))
);
const router = useRouter();
const goToGenre = (genre) => {
    if (genre.variants.length === 1) {
        router.push({
            name: "parser",
            query: {
                genre_id: genre.variants[0].id,
            },
        });
        return;
    }
    selectedGenre.value = genre;
    selectParserActive.value = true;
};
</script>
<style scoped lang="scss">
.search-page {
    display: flex;
    flex-direction: column;
    padding: 10px;
    gap: 10px;

    .genres {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        .genre {
            padding: 10px 20px;
            font-size: 16px;
            flex-grow: 1;
            @include flex-center;
        }
    }
    .sections {
        display: flex;
        gap: 10px;
        margin-top: 10px;

        section {
            display: flex;
            flex-direction: column;
            gap: 10px;
            .headline {
                font-size: 20px;
                font-weight: bold;
            }
        }
    }
}
</style>
