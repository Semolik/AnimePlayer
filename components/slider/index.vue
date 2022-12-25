<template>
    <div class="app-slider">
        <div class="slide" ref="slide-1">
            <BlurHashCanvas
                :hash="title.poster.blurhash"
                :width="1200"
                :height="436"
            />
            <img :src="title.poster.url" alt="" />
            <div class="info">
                <div class="title">{{ title.ru_title }}</div>
                <div class="description">{{ title.description }}</div>
            </div>
        </div>
    </div>
</template>
<script setup>
import data from "../../test-titles";
const title = data.titles[0];
// import Flicking from "@egjs/vue3-flicking";
</script>
<style lang="scss">
.app-slider {
    // display: flex;
    overflow: hidden;
    width: 100%;
    @include flex-center;
    .slide {
        width: 1200px;
        display: flex;
        overflow: hidden;
        padding: 16px;
        border-radius: 24px;
        position: relative;
        gap: 10px;
        isolation: isolate;
        // background-color: rgba($color: white, $alpha: 0.1);
        img {
            border-radius: 8px;
            object-fit: cover;
        }
        .info {
            display: flex;
            flex-direction: column;
            gap: 10px;
            .description {
                font-size: 17px;
                font-weight: 400;
                color: $primary-text;
                // text-align: center;
            }
            .title {
                font-size: 32px;
                font-weight: 700;
                color: $primary-text;
                text-align: center;
            }
        }

        canvas {
            position: absolute;
            inset: 0;
            z-index: -2;
        }
        &::after {
            content: "";
            position: absolute;
            inset: 0;
            z-index: -1;
            background-color: rgba($color: black, $alpha: 0.3);
        }
    }
}
</style>
