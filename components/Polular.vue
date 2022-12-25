<template>
    <div class="popular-container">
        <div class="slider-button" @click="$refs.flicking.prev()">
            <Icon name="material-symbols:arrow-back-ios-new-rounded" />
        </div>
        <Flicking
            ref="flicking"
            :options="{
                align: 'prev',
                bound: true,
                bounce: '5%',
            }"
        >
            <CardSmall
                v-for="(card, index) in [...data.titles, ...data.titles]"
                :card="card"
                :key="index"
            />
        </Flicking>
        <div class="slider-button next" @click="$refs.flicking.next()">
            <Icon name="material-symbols:arrow-back-ios-new-rounded" />
        </div>
    </div>
</template>
<script setup>
import Flicking from "@egjs/vue3-flicking";
import data from "../test-titles";
</script>
<style lang="scss">
.popular-container {
    display: flex;
    overflow: hidden;
    gap: 12px;
    width: 100%;
    .flicking-camera {
        gap: 12px;
    }
    .slider-button {
        border-radius: 8px;
        height: 250px;
        @include flex-center;
        color: $primary-text;
        padding: 12px;
        cursor: pointer;
        &.next {
            svg {
                rotate: 180deg;
            }
        }
        background-color: $secondary-bg;
        &:hover {
            background-color: $tertiary-bg;
        }
    }
    // justify-content: center;
    // flex-direction: column;
}
</style>
