<template>
    <scroll :hide-controls="hideControls" ref="episodesList">
        <episode-card
            v-for="episode in episodes"
            :key="episode.id"
            :episode="episode"
            :title="title"
            :more-info="showTitleName"
            :close-button="showCloseButton"
            @close="emit('close', episode)"
        />
        <slot></slot>
    </scroll>
</template>
<script setup>
const { episodes, title, showTitleName, showCloseButton, hideControls } =
    defineProps({
        episodes: {
            type: Array,
            required: true,
        },
        title: {
            type: Object,
            required: false,
        },
        showTitleName: {
            type: Boolean,
            default: false,
        },
        showCloseButton: {
            type: Boolean,
            default: false,
        },
        hideControls: {
            type: Boolean,
            default: false,
        },
    });
const emit = defineEmits(["close"]);
const episodesList = ref(null);
const scrollRight = computed(() => episodesList.value?.scrollRight);
const scrollLeft = computed(() => episodesList.value?.scrollLeft);
const scrollRightActive = computed(() => episodesList?.value.scrollRightActive);
const scrollLeftActive = computed(() => episodesList?.value.scrollLeftActive);

defineExpose({
    scrollRight,
    scrollLeft,
    scrollRightActive,
    scrollLeftActive,
});
</script>
