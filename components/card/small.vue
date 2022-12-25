<template>
    <nuxt-link class="small-card">
        <div class="picture">
            <BlurHashCanvas
                :hash="card.poster.blurhash"
                :width="pictureSize.x"
                :height="pictureSize.y"
            />
            <!-- <img :src="card.poster.url" :alt="card.ru_title" /> -->
        </div>
        <div class="title">{{ card.ru_title }}</div>
    </nuxt-link>
</template>
<script setup>
import BlurHashCanvas from "../BlurHashCanvas.vue";
const pictureSize = { x: 170, y: 250 };
const pictureHeight = pictureSize.y + "px";
const pictureWidth = pictureSize.x + "px";
const { card } = defineProps({
    card: Object,
});
</script>
<style lang="scss">
.small-card {
    display: flex;
    flex-direction: column;
    max-width: v-bind(pictureWidth);
    widows: 100%;
    gap: 8px;
    cursor: pointer;
    .picture {
        height: v-bind(pictureHeight);
        aspect-ratio: 2 / 3;
        // min-width: v-bind(pictureWidth);
        border-radius: 8px;
        overflow: hidden;
        position: relative;
        isolation: isolate;
        &::after {
            content: "";
            position: absolute;
            inset: 0;
            z-index: 2;
        }
        img {
            z-index: 1;
            width: 100%;
            height: 100%;
            object-fit: cover;
            user-select: none;
        }
        canvas {
            z-index: -1;
            position: absolute;
            inset: 0;
        }
    }

    .title {
        font-size: 15px;
        line-height: 20px;
        font-weight: bold;
        color: $secondary-text;
    }
    &:hover {
        .title {
            color: $primary-text;
        }
    }
}
</style>
