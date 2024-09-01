<template>
    <div class="episodes">
        <episode-card
            class="episode-card"
            v-for="episode in episodes"
            :key="episode.id"
            :episode="episode"
            :title="episode?.title || null"
            :more-info="moreInfo"
        />
    </div>
</template>
<script setup>
const { episodes, moreInfo } = defineProps({
    episodes: Array,
    moreInfo: Boolean,
    title: Object,
});
</script>
<style scoped lang="scss">
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
</style>
