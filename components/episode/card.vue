<template>
    <div
        :class="['episode-card', { loading }]"
        @click="playerStore.playEpisode(episode)"
    >
        <div
            :class="['episode-picture', { loaded: image_loaded }]"
            :style="{ '--progress': episode.progress + '%' }"
        >
            <img :src="imageUrl" v-show="image_loaded" />
            <div class="placeholder animate-pulse bg-cool-700"></div>
            <div class="loading-placeholder">
                <Icon name="svg-spinners:180-ring-with-bg" />
            </div>
        </div>
        <div class="episode-name">
            <div class="dot" v-if="episode.progress == 0"></div>

            {{ episode.name }}
        </div>
    </div>
</template>
<script setup>
import { usePlayerStore } from "~/stores/player";
const playerStore = usePlayerStore();
const { currentEpisode, isOpen } = storeToRefs(playerStore);
const { episode, title } = defineProps({
    episode: Object,
    title: Object,
});
const imageUrl = episode.image_url || title.image_url;
const image_loaded = ref(false);
const loading = computed(
    () =>
        currentEpisode.value &&
        currentEpisode.value.id === episode.id &&
        !isOpen.value
);
onMounted(() => {
    if (!imageUrl) {
        return;
    }
    image_loaded.value = false;
    var image = new Image();
    image.src = imageUrl;
    image.onload = () => {
        image_loaded.value = true;
    };
});
</script>
<style scoped lang="scss">
.episode-card {
    height: min-content;
    min-width: 200px;
    cursor: pointer;

    @include md {
        min-width: 280px;
    }
    &.loading .episode-picture .loading-placeholder {
        opacity: 1;
    }

    .episode-picture {
        user-select: none;
        aspect-ratio: 16 / 9;
        border-radius: 10px;
        position: relative;
        overflow: hidden;
        &::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            width: var(--progress);
            height: 5px;
            background-color: $accent;
        }

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        &.loaded {
            .placeholder {
                display: none;
            }
        }
        .placeholder {
            position: absolute;
            inset: 0;
        }

        .loading-placeholder {
            position: absolute;
            inset: 0;
            @include flex-center;
            color: $primary-text;
            background-color: rgba(0, 0, 0, 0.5);
            opacity: 0;
            transition: opacity 0.3s;
            svg {
                width: 35px;
                height: 35px;
            }
        }
    }

    .episode-name {
        color: $primary-text;
        font-size: 1rem;
        margin-top: 5px;
        display: flex;
        align-items: center;
        margin-left: 5px;
        position: relative;

        .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: $accent;
            display: inline-block;
            margin-right: 5px;
        }
    }
}
</style>
