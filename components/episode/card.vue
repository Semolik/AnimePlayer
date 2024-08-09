<template>
    <div
        :class="['episode-card', { loading }]"
        @click="playerStore.playEpisode(episode)"
    >
        <div
            :class="[
                'episode-picture',
                { loaded: image_loaded },
                { 'has-progress': episode.progress && episode.progress > 0 },
            ]"
            :style="{ '--progress': episode.progress + '%' }"
        >
            <div class="shadow"></div>
            <img :src="imageUrl" v-show="image_loaded" />
            <div class="duration" v-if="episode.duration_label && image_loaded">
                {{ episode.duration_label }}
            </div>
            <div class="placeholder animate-pulse bg-cool-700"></div>
            <div class="loading-placeholder">
                <Icon name="svg-spinners:180-ring-with-bg" />
            </div>
        </div>
        <div class="episode-name">
            <div class="dot" v-if="episode.progress == 0 && logined"></div>

            {{ episode.name }}
        </div>
    </div>
</template>
<script setup lang="ts">
import { usePlayerStore } from "~/stores/player";
import { useAuthStore } from "~/stores/auth";
import type { Episode, TitleShort, Title } from "~/client";
const playerStore = usePlayerStore();
const authStore = useAuthStore();
const { logined } = storeToRefs(authStore);
const { currentEpisode, isOpen } = storeToRefs(playerStore);
const { episode, title } = defineProps({
    episode: {
        type: Object as PropType<Episode>,
        required: true,
    },
    title: {
        type: Object as PropType<Title | TitleShort>,
        required: false,
    },
}) as {
    episode: Episode;
    title?: Title | TitleShort;
};

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
    min-width: 200px;
    cursor: pointer;
    width: min-content;
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
            .shadow {
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
</style>
