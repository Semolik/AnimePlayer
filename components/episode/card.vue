<template>
    <div class="episode-card">
        <div
            :class="['episode-picture', { loaded: image_loaded }]"
            :style="{ '--progress': episode.progress + '%' }"
        >
            <img :src="imageUrl" v-show="image_loaded" />
            <div class="placeholder animate-pulse bg-cool-700"></div>
        </div>
        <div class="episode-name">
            <div class="dot" v-if="episode.progress == 0"></div>

            {{ episode.name }}
        </div>
    </div>
</template>
<script setup>
const { episode, title } = defineProps({
    episode: Object,
    title: Object,
});
const imageUrl = episode.image_url || title.image_url;
const image_loaded = ref(false);
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

    @include md {
        min-width: 280px;
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
