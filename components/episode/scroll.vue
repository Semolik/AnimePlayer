<template>
    <div class="episodes-list-wrapper">
        <div
            :class="[
                'scroll-button scroll-button-left',
                { hide: !scrollLeftActive },
            ]"
            @click="x -= scrollStep"
        >
            <Icon name="i-heroicons-chevron-left" />
        </div>
        <div class="episodes-list" ref="episodesList" v-auto-animate>
            <episode-card
                v-for="episode in episodes"
                :key="episode.id"
                :episode="episode"
                :title="title"
                class="episode-item"
                :more-info="showTitleName"
                :close-button="showCloseButton"
                @close="emit('close', episode)"
            />

            <slot />
        </div>
        <div
            :class="[
                'scroll-button scroll-button-right',
                { hide: !scrollRightActive },
            ]"
            @click="x += scrollStep"
        >
            <Icon name="i-heroicons-chevron-right" />
        </div>
    </div>
</template>
<script setup>
const { episodes, title, showTitleName, showCloseButton } = defineProps({
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
});
const emit = defineEmits(["close"]);
const episodesList = ref(null);
const { x, y } = useScroll(episodesList, { behavior: "smooth" });
const scrollLeftActive = computed(() => x.value > 0);
const mounted = ref(false);
onMounted(() => {
    mounted.value = true;
});
const scrollRightActive = computed(
    () =>
        mounted.value &&
        x.value <
            episodesList.value.scrollWidth - episodesList.value.clientWidth
);
const scrollStep = computed(() => episodesList.value.clientWidth * 0.7);
</script>
<style scoped lang="scss">
.episodes-list-wrapper {
    display: grid;
    gap: 10px;
    position: relative;
    max-width: 100vw;
    overflow-x: hidden;
    @include md {
        @include lg(true) {
            overflow: hidden;
        }
    }
    .episodes-list {
        display: flex;
        gap: 10px;
        height: min-content;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        scroll-padding: 0 10px;
        position: relative;

        &::-webkit-scrollbar {
            display: none;
        }
        @include md(true) {
            padding-right: 10px;
        }
        .episode-item {
            scroll-snap-align: start;

            @include md(true) {
                &:first-child {
                    margin-left: 10px;
                }
            }
        }
    }
    .scroll-button {
        position: absolute;
        background-color: $primary-bg;
        @include flex-center;
        cursor: pointer;
        height: 110px;
        padding: 0 5px;
        border-radius: 10px;
        opacity: 1;
        transition: opacity 0.3s;
        &.hide {
            cursor: default;
            opacity: 0;
        }
        @include rwd(1300, true) {
            background-color: $tertiary-bg;
            &.hide {
                svg {
                    color: darken($accent, 10%);
                }
            }
        }

        @include rwd(1300, true) {
            &.hide {
                display: none;
            }
        }
        @include md(true) {
            display: none;
        }
        @include md {
            height: 157px;
            @include rwd(1300, true) {
                position: inherit;
            }
        }
        @include rwd(1300) {
            &-right {
                left: calc(100% + 10px);
            }

            &-left {
                right: calc(100% + 10px);
            }
        }
        svg {
            width: 30px;
            height: 30px;
            color: $accent;
        }

        &:hover {
            background-color: $tertiary-bg;
        }
    }
}
</style>
