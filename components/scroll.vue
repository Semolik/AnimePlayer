<template>
    <div
        :class="[
            'items-list-wrapper',
            { 'is-episodes': isEpisodes },
            { padded },
        ]"
    >
        <div
            :class="[
                'scroll-button scroll-button-left',
                { hide: !scrollLeftActive },
            ]"
            @click="x -= scrollStep"
            v-if="!hideControls && !hideButtons"
        >
            <Icon name="i-heroicons-chevron-left" />
        </div>
        <div class="items-list" ref="episodesList" v-auto-animate>
            <slot />
        </div>
        <div
            v-if="!hideControls && !hideButtons"
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
const { hideControls, padded, isEpisodes, buttonHeightBig, buttonHeight } =
    defineProps({
        hideControls: {
            type: Boolean,
            default: false,
        },
        padded: {
            type: Boolean,
            default: false,
        },
        isEpisodes: {
            type: Boolean,
            default: false,
        },
        buttonHeight: {
            type: String,
            default: "110px",
        },

        buttonHeightBig: {
            type: String,
            default: "157.5px",
        },
    });
const { $viewport } = useNuxtApp();
const isMobile = computed(() => $viewport.isLessThan("tablet"));
const episodesList = ref(null);
const { x, y } = useScroll(episodesList, { behavior: "smooth" });
const scrollLeftActive = computed(() => x.value > 0);
const mounted = ref(false);
const hideButtons = ref(false);
const scrollRightActive = computed(
    () =>
        mounted.value &&
        x.value <
            episodesList.value.scrollWidth - episodesList.value.clientWidth
);
onMounted(() => {
    mounted.value = true;
    hideButtons.value = isMobile.value || !scrollRightActive.value;
});
const scrollStep = computed(() => episodesList.value.clientWidth * 0.7);
const scrollRight = () => {
    x.value += scrollStep.value;
};
const scrollLeft = () => {
    x.value -= scrollStep.value;
};

defineExpose({
    scrollRight,
    scrollLeft,
    scrollRightActive,
    scrollLeftActive,
});
</script>
<style scoped lang="scss">
.items-list-wrapper {
    display: grid;
    grid-template-columns: auto 1fr auto;

    position: relative;
    max-width: 100vw;
    @include md {
        @include lg(true) {
            overflow: hidden;
        }
    }
    @include rwd(1300, true) {
        gap: 10px;
    }
    &.padded {
        .scroll-button {
            margin-top: 10px;
        }
        .items-list {
            padding-top: 10px;
        }
    }
    .items-list {
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
        & > * {
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
        height: v-bind(buttonHeight);
        padding: 0 5px;
        border-radius: 10px;
        opacity: 1;
        transition: opacity 0.3s, background-color 0.3s;
        &.hide {
            cursor: default;
            // opacity: 0;
            background-color: $secondary-bg;
            &:hover {
                background-color: $secondary-bg;
            }

            svg {
                color: $secondary-text !important;
            }
        }
        @include rwd(1300, true) {
            background-color: $tertiary-bg;
            &.hide {
                svg {
                    color: darken($accent, 10%);
                }
            }
        }

        @include md(true) {
            display: none;
        }
        @include md {
            height: v-bind(buttonHeightBig);
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
            transition: color 0.3s;
        }

        &:hover {
            background-color: $tertiary-bg;
        }
    }
}
</style>
