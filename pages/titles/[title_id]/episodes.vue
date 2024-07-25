<template>
    <div class="episodes-page">
        <div class="episodes">
            <episode-card
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
</script>
<style scoped lang="scss">
.episodes-page {
    display: flex;
    flex-direction: column;
    padding: 20px;
    .episodes {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
    }
}
</style>
