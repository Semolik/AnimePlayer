<template>
    <div :class="['episode-card', { loading }, { 'more-info': moreInfo }]">
        <div
            :class="[
                'episode-picture',
                { loaded: image_loaded },
                { 'has-progress': episode.progress && episode.progress > 0 },
            ]"
            :style="{ '--progress': episode.progress + '%' }"
            @click="playerStore.playEpisode(episode)"
        >
            <div class="card-shadow"></div>
            <img :src="imageUrl" v-show="image_loaded" />
            <div class="duration" v-if="episode.duration_label && image_loaded">
                {{ episode.duration_label }}
            </div>
            <div class="placeholder animate-pulse bg-cool-700"></div>
            <div class="loading-placeholder">
                <Icon name="svg-spinners:180-ring-with-bg" />
            </div>
            <div class="hover-placeholder">
                <Icon name="i-heroicons:play" />
            </div>
            <div
                class="close-button"
                v-if="closeButton"
                @click.stop="emit('close')"
            >
                <Icon name="material-symbols:close-rounded" />
            </div>
        </div>
        <div class="title-name" v-if="titleName">
            <span>
                {{ titleName }}
            </span>
            <div class="more-menu" v-if="moreInfo" @click="menuOpen = true">
                <Icon name="material-symbols:more-horiz" />
            </div>
        </div>
        <div class="episode-name">
            <div class="dot" v-if="episode.progress == 0 && logined"></div>
            {{ episode.name }}
        </div>
    </div>
    <USlideover
        v-model="menuOpen"
        side="bottom"
        :ui="{ height: '' }"
        v-if="moreInfo"
    >
        <div class="menu">
            <div class="head">
                <span> Меню </span>
                <div class="close" @click="menuOpen = false">
                    <Icon name="material-symbols:close-rounded" />
                </div>
            </div>
            <nuxt-link class="menu-item" :to="titleLink">
                <Icon name="material-symbols:info" />
                <span>Подробнее</span>
            </nuxt-link>
            <nuxt-link class="menu-item" :to="`${titleLink}/episodes`">
                <Icon name="system-uicons:episodes" />
                <span>Список серий</span>
            </nuxt-link>
            <div class="menu-item" @click="emit('close')">
                <Icon name="material-symbols:close-rounded" />
                <span>Скрыть из подборки</span>
            </div>
        </div>
    </USlideover>
</template>
<script setup lang="ts">
import { usePlayerStore } from "~/stores/player";
import { useAuthStore } from "~/stores/auth";
import type { Episode, TitleEpisode, TitleShort, Title } from "~/client";
const playerStore = usePlayerStore();
const authStore = useAuthStore();
const { logined } = storeToRefs(authStore);
const { currentEpisode, isOpen } = storeToRefs(playerStore);
const emit = defineEmits(["close"]);
const menuOpen = ref(false);
const { episode, title, moreInfo, closeButton } = defineProps({
    episode: {
        type: Object as PropType<Episode | TitleEpisode>,
        required: true,
    },
    title: {
        type: Object as PropType<Title | TitleShort>,
        required: false,
    },
    moreInfo: {
        type: Boolean,
        default: false,
    },
    closeButton: {
        type: Boolean,
        default: false,
    },
}) as {
    episode: Episode | TitleEpisode;
    title?: Title | TitleShort;
    moreInfo: boolean;
    closeButton: boolean;
};
const titleName = computed(() => {
    if (!moreInfo) {
        return;
    }
    if ("title" in episode && episode.title) {
        return episode.title.name;
    }
    return title?.name;
});
const titleLink = computed(() => {
    if (!moreInfo) {
        return;
    }
    if ("title" in episode && episode.title) {
        return `/titles/${episode.title.id}`;
    }
    return `/titles/${title?.id}`;
});
const imageUrl = episode.image_url || (title && title.image_url);
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
    min-width: 190px;
    cursor: pointer;
    width: min-content;
    @include md {
        min-width: 290px;
    }
    &.loading .episode-picture .loading-placeholder {
        opacity: 1;
    }
    @include md {
        &:not(.loading) .episode-picture:hover .hover-placeholder {
            opacity: 1;
        }
    }

    .episode-picture {
        user-select: none;
        aspect-ratio: 16 / 9;
        border-radius: 10px;
        position: relative;
        overflow: hidden;
        isolation: isolate;
        &:hover {
            .close-button {
                opacity: 1;
            }
        }
        .close-button {
            position: absolute;
            top: 8px;
            right: 8px;
            padding: 5px;
            background-color: black;
            border-radius: 50%;
            z-index: 3;
            color: $primary-text;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s, background-color 0.3s;
            svg {
                width: 17px;
                height: 17px;
            }

            &:hover {
                background-color: $tertiary-bg;
            }
        }
        &.has-progress::after {
            min-width: 10px;
        }
        &::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            width: var(--progress);
            height: 5px;
            background-color: $accent;
            z-index: 1;
        }

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 1;
        }
        &.loaded {
            .card-shadow {
                position: absolute;
                inset: 0;
                background: linear-gradient(
                        0.71deg,
                        rgba(0, 0, 0, 0.16) 0.61%,
                        rgba(0, 0, 0, 0.02) 22.51%,
                        rgba(0, 0, 0, 0.008) 25.52%,
                        transparent 28.34%,
                        transparent 50%
                    ),
                    linear-gradient(
                        302.67deg,
                        rgba(0, 0, 0, 0.8),
                        rgba(0, 0, 0, 0.1) 30.83%,
                        rgba(0, 0, 0, 0.04) 35.06%,
                        transparent 39.03%,
                        transparent 69.54%
                    );
            }
        }
        .placeholder {
            position: absolute;
            inset: 0;
            z-index: -1;
        }

        .hover-placeholder {
            z-index: 2;
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

        .duration {
            position: absolute;
            bottom: 10px;
            right: 10px;
            font-size: 0.8rem;
            color: $primary-text;
        }
    }
    &.more-info {
        min-width: 260px !important;
        @include md(true) {
            min-width: 200px !important;
        }

        .episode-name {
            padding-left: 0;
            color: $secondary-text;
            font-size: 14px;
            margin-top: 0;
            margin-left: 5px;
            &:has(.dot) {
                padding-left: 15px;
            }
        }
        .title-name {
            color: $primary-text;
            font-size: 14px;
            margin-top: 5px;
            margin-left: 5px;
            @include cut-text(1);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 5px;
            .more-menu {
                @include sm {
                    display: none;
                }
                svg {
                    width: 23px;
                    height: 23px;
                }
            }
        }
    }

    .episode-name {
        color: $primary-text;
        font-size: 1rem;
        margin-top: 5px;
        display: flex;
        align-items: center;
        padding-left: 15px;
        position: relative;
        .dot {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: 0;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: $accent;
            display: inline-block;
            margin-right: 5px;
        }
    }
}
.menu {
    padding: 10px 0px;
    display: flex;
    flex-direction: column;
    padding-right: 0px;

    .head {
        display: flex;
        justify-content: space-between;
        padding: 10px 15px;

        span {
            font-size: 20px;
            color: $primary-text;
            font-weight: 600;
        }

        .close {
            cursor: pointer;
            background-color: $quaternary-bg;
            color: $secondary-text;
            padding: 5px;
            border-radius: 50%;
            svg {
                width: 20px;
                height: 20px;
            }
        }
    }
    .menu-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 15px;
        text-decoration: none;
        &:focus-visible {
            outline: none;
        }

        cursor: pointer;
        svg {
            width: 25px;
            height: 25px;
        }
        span {
            font-size: 16px;
            color: $primary-text;
        }
        &:not(:last-child) {
            border-bottom: 1px solid $senary-bg;
        }
    }
}
</style>
