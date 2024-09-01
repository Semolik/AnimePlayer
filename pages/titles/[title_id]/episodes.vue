<template>
    <div class="episodes-page">
        <UBreadcrumb :links="links" class="breadcrumb" />
        <episode-list :episodes="episodes" :title="titleEpisodesInfo.title" />
    </div>
</template>
<script setup>
import { usePlayerStore } from "~/stores/player";
import { TitlesService } from "~/client";
const route = useRoute();
const { title_id } = route.params;
const titleEpisodesInfo =
    await TitlesService.getEpisodesApiV1TitlesTitleIdEpisodesGet(title_id);
const playerStore = usePlayerStore();
const { currentEpisodes } = storeToRefs(playerStore);
const episodes = ref(titleEpisodesInfo.episodes);

watch(currentEpisodes, (value) => {
    value.map((episode) => {
        const index = episodes.value.findIndex((e) => e.id === episode.id);
        if (index !== -1) {
            episodes.value[index] = episode;
        }
    });
});
const parser = getParser(titleEpisodesInfo.title.parser_id);
const { $viewport } = useNuxtApp();
const links = computed(() => {
    var arr = [
        {
            label: titleEpisodesInfo.title.name,
            to: `/titles/${titleEpisodesInfo.title.id}`,
        },
        { label: "Серии" },
    ];
    if ($viewport.isGreaterOrEquals("tablet")) {
        arr.unshift({
            label: parser.name,
            to: `/parser?parser_id=${titleEpisodesInfo.title.parser_id}`,
        });
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

    @include sm(true) {
        padding: 10px;
    }
}
</style>
