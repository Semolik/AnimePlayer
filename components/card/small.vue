<template>
    <nuxt-link class="small-card">
        <div class="picture">
            <img :src="card.poster.url" alt="" />
        </div>
        <BlurHashCanvas :hash="card.poster.blurhash" />
        <div class="title">{{ card.ru_title }}</div>
    </nuxt-link>
</template>
<script setup>
import BlurHashCanvas from "../BlurHashCanvas.vue";

const { card } = defineProps({
    card: Object,
});
</script>
<style lang="scss">
.small-card {
    display: flex;
    flex-direction: column;
    max-width: 170px;
    widows: 100%;
    gap: 8px;
    cursor: pointer;
    .picture {
        height: 250px;
        width: 100%;
        border-radius: 8px;
        overflow: hidden;
        position: relative;
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
