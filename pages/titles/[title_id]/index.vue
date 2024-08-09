<template>
    <div class="title-page">
        <UBreadcrumb :links="links" class="breadcrumb" />
        <div :class="['picture', { loaded: image_loaded }]">
            <nuxt-link
                class="back"
                :to="`/parser?parser_id=${title.parser_id}`"
            >
                <Icon name="i-heroicons-arrow-left" />
            </nuxt-link>
            <img
                :src="title.image_url"
                :alt="title.name"
                v-show="image_loaded"
            />
            <div class="placeholder animate-pulse bg-cool-700"></div>
        </div>
        <div class="page-content">
            <div class="names">
                <div :class="['name', { 'small-title': smallTitle }]">
                    {{ title.name }}
                </div>
                <div class="en_title" v-if="title.en_name">
                    {{ title.en_name }}
                </div>
            </div>
            <div class="flex gap-[10px] lg:w-min lg:flex-row flex-col mb-auto">
                <UButton
                    block
                    size="xl"
                    :ui="{ rounded: 'rounded-lg' }"
                    icon="i-heroicons-play"
                    class="lg:px-6"
                    trailing
                    @click="
                        playerStore.playEpisode(
                            title.current_episode || title.episodes[0]
                        )
                    "
                    v-if="title.episodes.length"
                >
                    {{
                        title.current_episode
                            ? title.current_episode.name
                            : "Смотреть"
                    }}
                </UButton>
                <Button
                    class="lg:w-min lg:px-6 whitespace-nowrap flex items-center justify-center gap-2 favorite-button"
                    active
                    highlightActive
                    :border-radius="10"
                    @clicked="addToFavorite"
                >
                    <span class="lg:hidden"> В избранное </span>
                    <Icon
                        :name="
                            !title.liked
                                ? 'i-heroicons-bookmark'
                                : 'heroicons:bookmark-20-solid'
                        "
                        :class="[
                            'w-[20px] h-[20px]',
                            { favorite: title.liked },
                        ]"
                    />
                </Button>
            </div>
            <div class="info">
                <div class="item" v-if="title.year">
                    <Icon name="system-uicons:calendar-month" />
                    <div class="item-col">
                        <span class="label">Год</span>
                        <span class="value">{{ title.year }}</span>
                    </div>
                </div>
                <div class="item" v-if="title.series_info">
                    <Icon name="system-uicons:episodes" />
                    <div class="item-col">
                        <span class="label">Серии</span>
                        <span class="value">{{ title.series_info }}</span>
                    </div>
                </div>
                <div class="item" v-if="title.duration">
                    <Icon name="system-uicons:clock" />
                    <div class="item-col">
                        <span class="label">Продолжительность</span>
                        <span class="value">{{ title.duration }}</span>
                    </div>
                </div>
                <a
                    class="item shikimori"
                    :href="title.shikimori.data.url"
                    target="_blank"
                    v-if="title.shikimori && title.shikimori.data.score"
                >
                    <Icon name="simple-icons:shikimori" />
                    <div class="item-col">
                        <span class="label">Shikimori</span>
                        <span class="value">
                            {{ title.shikimori.data.score }}
                        </span>
                    </div>
                </a>
            </div>
            <div class="genres">
                <nuxt-link
                    v-for="genre in title.genres"
                    :key="genre.id"
                    :to="`/parser?genre_id=${genre.id}`"
                    class="genre"
                >
                    {{ genre.name }}
                </nuxt-link>
            </div>
        </div>
        <div class="desctiption">
            {{ title.description }}
        </div>
        <div class="alert" v-if="title.episodes_message">
            <UAlert
                color="primary"
                variant="subtle"
                :description="title.episodes_message"
            />
        </div>
        <div class="episodes" v-if="title.episodes.length">
            <div class="headline">
                <span> Серии </span>
                <nuxt-link :to="`/titles/${title.id}/episodes`" class="more">
                    Все
                </nuxt-link>
            </div>

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
                <div class="episodes-list" ref="episodesList">
                    <episode-card
                        v-for="episode in episodes"
                        :key="episode.id"
                        :episode="episode"
                        :title="title"
                        class="episode-item"
                    />
                    <nuxt-link
                        v-if="title.episodes.length > 10"
                        :to="`/titles/${title.id}/episodes`"
                        class="more-episode"
                    >
                        <div class="dots-container">
                            <div class="dots">
                                <Icon name="material-symbols:more-horiz" />
                            </div>
                        </div>
                    </nuxt-link>
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
        </div>
        <login-modal v-model:active="loginModalActive" />
    </div>
</template>
<script setup>
import { TitlesService } from "~/client";
import { useAuthStore } from "~/stores/auth";
import { usePlayerStore } from "~/stores/player";
const route = useRoute();
const siteConfig = useSiteConfig();
const authStore = useAuthStore();
const playerStore = usePlayerStore();
const { logined } = storeToRefs(authStore);
const { title_id } = route.params;
const title = ref(await TitlesService.getTitleApiV1TitlesTitleIdGet(title_id));

watch(logined, async (value) => {
    if (value) {
        title.value = await TitlesService.getTitleApiV1TitlesTitleIdGet(
            title_id
        );
    }
});
const smallTitle = title.value.name.length < 40;
const loginModalActive = ref(false);
const parser = getParser(title.value.parser_id);
const links = [
    { label: parser.name, to: `/parser?parser_id=${title.value.parser_id}` },
    { label: title.value.name },
];
useSeoMeta({
    title: title.value.name,
    description: title.value.description,
});
const episodes = ref(title.value.episodes.slice(0, 10));
const updateEpisodeBus = useEventBus("update-episode");
updateEpisodeBus.on((episode) => {
    title.value.current_episode = episode;
    const index = episodes.value.findIndex((e) => e.id === episode.id);
    if (index !== -1) {
        episodes.value[index] = episode;
    }
});
defineOgImageComponent("title", {
    title: title.value.name,
    image: title.value.image_url,
    description: title.value.description,
    link: new URL(siteConfig.url).host,
});
const mounted = ref(false);
const image_loaded = ref(false);
onMounted(() => {
    mounted.value = true;
    image_loaded.value = false;
    var image = new Image();
    image.src = title.value.image_url;
    image.onload = () => {
        image_loaded.value = true;
    };
});

const episodesList = ref(null);
const { x, y } = useScroll(episodesList, { behavior: "smooth" });
const scrollLeftActive = computed(() => x.value > 0);
const scrollRightActive = computed(
    () =>
        mounted.value &&
        x.value <
            episodesList.value.scrollWidth - episodesList.value.clientWidth
);
const scrollStep = computed(() => episodesList.value.clientWidth * 0.7);
const addToFavorite = async () => {
    if (!logined.value) {
        loginModalActive.value = true;
        return;
    }
    await TitlesService.favoriteTitleApiV1TitlesFavoritesTitleIdPost(title_id);
    title.value.liked = !title.value.liked;
};
</script>
<style scoped lang="scss">
.title-page {
    max-width: 1100px;
    width: 100%;
    margin: 0 auto;
    display: grid;
    gap: 20px;
    grid-template-columns: 250px 1fr;
    @include lg(true) {
        grid-template-columns: 1fr;
    }
    @include md {
        padding: 20px;
        padding-top: 0px;
    }
    .breadcrumb {
        grid-column: 1 / -1;

        @include md(true) {
            display: none;
        }
    }
    .favorite-button .favorite {
        color: $accent;
    }
    .picture {
        overflow: hidden;
        min-height: 350px;
        width: 100%;
        position: relative;
        &.loaded {
            .placeholder {
                display: none;
            }
        }
        .placeholder {
            position: absolute;
            inset: 0;
        }

        @include lg(true) {
            @include md {
                max-height: 450px;
            }
        }
        @include sm(true) {
            height: 60vh;
            position: relative;
            isolation: isolate;
            &::before {
                content: "";
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 100px;
                background: linear-gradient(
                    180deg,
                    rgba($primary-bg, 0) 0%,
                    rgba($primary-bg, 0.5) 25%,
                    rgba($primary-bg, 0.8) 50%,
                    rgba($primary-bg, 1) 90%,
                    rgba($primary-bg, 1) 100%
                );
            }
        }
        @include sm {
            border-radius: 10px;
            height: min-content;
        }

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .back {
            position: absolute;
            border-radius: 10px;
            width: 45px;
            height: 45px;
            aspect-ratio: 1;
            top: 10px;
            left: 10px;
            z-index: 1;
            @include flex-center;
            background-color: rgba($primary-bg, 0.7);
            backdrop-filter: blur(10px);

            @include sm {
                display: none;
            }

            svg {
                width: 20px;
                height: 20px;
                color: $primary-text;
            }
        }
    }
    .page-content {
        display: flex;
        flex-direction: column;
        gap: 10px;
        @include md(true) {
            padding: 0px 10px;
        }
        .genres {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            @include md(true) {
                justify-content: center;
                .genre {
                    flex-grow: 1;
                }
            }
            .genre {
                background-color: $senary-bg;
                padding: 5px 20px;
                border-radius: 999px;
                border-radius: 10px;
                text-align: center;

                @include md {
                    padding: 2px 20px;

                    &:hover {
                        background: $octonary-bg;
                    }
                }
            }
        }
        .names {
            display: flex;
            flex-direction: column;
            gap: 15px;
            @include md {
                margin-top: 10px;

                @include lg(true) {
                    margin-bottom: 20px;
                }
            }
            .name {
                color: $primary-text;
                font-size: 2.3rem;
                line-height: 40px;
            }
            @include md(true) {
                padding: 10px;
                padding-top: 0px;
                text-align: center;
                gap: 10px;
                .name {
                    font-size: 1.5rem;
                    line-height: 30px;

                    &.small-title {
                        font-size: 2rem;
                        line-height: 40px;
                    }
                }
                .en_title {
                    font-size: 0.9rem;
                }
            }

            .en_title {
                color: $secondary-text;
            }
        }

        .info {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            .item {
                @include sm(true) {
                    flex-grow: 1;
                    flex-basis: 150px;
                }
                display: flex;
                gap: 10px;
                align-items: center;
                background-color: $quaternary-bg;
                padding: 5px 10px;
                border-radius: 10px;
                svg {
                    width: 35px;
                    height: 35px;
                    color: $accent;
                }
                @include md {
                    padding: 10px 20px;
                }
                &.shikimori {
                    background-color: $quinary-bg;
                    svg {
                        width: 30px;
                        height: 30px;
                    }
                    @include md {
                        &:hover {
                            background: $senary-bg;
                        }
                    }
                }
                .item-col {
                    display: flex;
                    flex-direction: column;

                    .label {
                        color: $secondary-text;
                        font-size: 10px;
                    }

                    .value {
                        color: $primary-text;
                        font-size: 15px;
                    }
                }
            }
        }
    }
    .alert,
    .desctiption,
    .episodes {
        grid-column: 1 / -1;
    }
    .alert,
    .desctiption {
        @include md(true) {
            padding: 0px 10px;
        }
    }

    .episodes {
        display: flex;
        flex-direction: column;
        gap: 10px;

        @include lg(true) {
            overflow: hidden;
        }
        @include md(true) {
            max-width: 100vw;
        }

        .headline {
            @include md(true) {
                padding: 0px 10px;
            }
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;

            span {
                font-size: 1.5rem;
                font-weight: 600;
                color: $primary-text;
            }

            .more {
                color: $accent;
                font-size: 1rem;
                font-weight: 600;
                text-decoration: none;
                padding: 5px 10px;

                &:hover {
                    text-decoration: underline;
                }
            }
        }

        .episodes-list-wrapper {
            display: flex;
            gap: 10px;
            position: relative;
            max-width: 100vw;
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
                .more-episode {
                    min-width: 200px;

                    @include md {
                        min-width: 280px;

                        &:hover .dots-container {
                            background: $quaternary-bg;
                        }
                    }

                    .dots-container {
                        background-color: $tertiary-bg;
                        border-radius: 10px;
                        @include flex-center;
                        width: 100%;
                        aspect-ratio: 16 / 9;
                        .dots {
                            border-radius: 50%;
                            width: 70px;
                            height: 70px;
                            @include flex-center;
                            background-color: $quinary-bg;
                            svg {
                                width: 25px;
                                height: 25px;
                            }
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
    }
}
</style>
