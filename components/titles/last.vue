<template>
    <titles
        :titles="titlesData"
        card-class="title-card"
        :class="['main-titles', { loaded: !loading }]"
    />
</template>
<script setup>
import { ParsersService } from "~/client";
const { parserId } = defineProps({
    parserId: {
        type: String,
        required: true,
    },
});

const loading = ref(true);
const titlesData = ref(markRaw(Array.from({ length: 16 }, (_, i) => null)));

onMounted(async () => {
    const page =
        await ParsersService.getMainTitlesApiV1ParsersParserIdTitlesMainGet(
            parserId
        );
    titlesData.value = page.titles;
    loading.value = false;
});
</script>
<style lang="scss">
.main-titles {
    padding-top: 8px;
    grid-template-rows: auto auto;
    grid-auto-rows: 0px;
    position: relative;
    overflow: hidden;

    @include sm(true) {
        display: flex;
        overflow-x: auto;
        min-height: 290px;
        scroll-snap-type: x mandatory;
        scroll-padding: 0 10px;
        padding: 0 10px;

        .title-card {
            display: flex !important;
            scroll-snap-align: start;
            flex: 0 0 170px;
        }
        &.loaded .title-card {
            &:first-child {
                margin-left: 10px;
            }
        }
    }
    @include xl(true) {
        .title-card:nth-child(n + 11) {
            display: none;
        }
    }
    @include rwd(1060, true) {
        .title-card:nth-child(n + 9) {
            display: none;
        }
    }
    @include rwd(860, true) {
        .title-card:nth-child(n + 7) {
            display: none;
        }
    }

    &::-webkit-scrollbar {
        display: none;
    }
}
</style>
