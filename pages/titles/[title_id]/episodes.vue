<template>
    <div class="episodes-page">
        <UBreadcrumb :links="links" class="breadcrumb" />
        <div class="episodes">
            <episode-card
                class="episode-card"
                v-for="episode in title.episodes"
                :key="episode.id"
                :episode="episode"
                :title="title"
            />
        </div>
    </div>
</template>
<script setup>
import { TitlesService } from "~/client";
const route = useRoute();
const { title_id } = route.params;
const title = await TitlesService.getTitleApiV1TitlesTitleIdGet(title_id);
const parser = getParser(title.parser_id);
const { $viewport } = useNuxtApp();
const links = computed(() => {
    var arr = [
        { label: title.name, to: `/titles/${title.id}` },
        { label: "Серии" },
    ];
    if ($viewport.isGreaterOrEquals("tablet")) {
        arr.unshift({ label: parser.name, to: `/${parser.id}` });
        arr.unshift({ label: "Главная", to: "/" });
    }
    return arr;
});
</script>
<style scoped lang="scss">
.episodes-page {
    display: flex;
    flex-direction: column;
    gap: 20px;

    @include md(true) {
        padding: 10px;
    }
    .episodes {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;

        @include md(true) {
            gap: 10px;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        }

        @include sm(true) {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        }

        .episode-card {
            @include sm(true) {
                min-width: 180px;
            }
        }
    }
}
</style>
