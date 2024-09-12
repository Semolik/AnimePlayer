<template>
    <div class="title-page">
        <div class="head">
            <UBreadcrumb :links="links" />
            <template v-if="otherParsers.length">
                <USelectMenu
                    :model-value="selectedParser"
                    @update:model-value="goToTitle"
                    :options="otherParsers"
                    option-attribute="parser_name"
                    class="min-w-[120px]"
                    :ui="{
                        rounded: 'rounded-lg',
                        option: {
                            rounded: 'rounded-lg',
                        },
                    }"
                    v-if="otherParsers.length > 1"
                >
                    <template #option="{ option }">
                        <span>{{ option.parser_name }}</span>
                    </template>
                </USelectMenu>
                <ClientOnly v-else>
                    <Teleport
                        to="#go-to-other-parser"
                        :disabled="teleportButtonDisabled"
                    >
                        <UButton
                            variant="outline"
                            :size="teleportButtonDisabled ? 'sm' : 'xl'"
                            :ui="{ rounded: 'rounded-lg' }"
                            @click="goToTitle(otherParsers[0])"
                            :block="!teleportButtonDisabled"
                        >
                            Открыть на {{ otherParsers[0].parser_name }}
                        </UButton>
                    </Teleport>
                </ClientOnly>
            </template>
        </div>
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
                <div id="go-to-other-parser" class="empty:hidden"></div>
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
                    @clicked="toggleFavorite"
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
                    v-if="title.shikimori"
                >
                    <Icon name="simple-icons:shikimori" />
                    <div class="item-col">
                        <span class="label">Shikimori</span>
                        <span class="value">
                            {{ title.shikimori.data.score || "0.0" }}
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
        <div class="alert" v-if="title.shikimori_failed">
            <UAlert
                color="red"
                variant="subtle"
                description="Не удалось загрузить данные с Shikimori"
            />
        </div>
        <section v-if="title.episodes.length" class="disable-padding">
            <div class="headline">
                <div class="title">
                    <span class="title"> Серии </span>
                    <nuxt-link
                        :to="`/titles/${title.id}/episodes`"
                        class="more"
                    >
                        Все
                    </nuxt-link>
                </div>
                <span class="subtitle" v-if="!logined">
                    Войдите в аккаунт, чтобы сохранять просмотренные серии
                </span>
            </div>

            <episode-scroll :episodes="episodes" :title="title">
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
            </episode-scroll>
        </section>

        <section
            v-if="title.related.length"
            :class="{ 'disable-padding': !relatedModeSwitched }"
        >
            <div class="headline">
                <div class="title">
                    <span> Связанные тайтлы </span>
                    <div
                        class="switch-view"
                        @click="relatedModeSwitched = !relatedModeSwitched"
                    >
                        <Icon
                            :name="
                                relatedModeSwitched
                                    ? 'system-uicons:list'
                                    : 'system-uicons:card-view'
                            "
                        />
                    </div>
                </div>
            </div>
            <scroll
                padded
                buttonHeight="200px"
                buttonHeightBig="300px"
                v-if="!relatedModeSwitched"
            >
                <titles-card
                    :title="titleItem"
                    v-for="titleItem in title.related"
                    :key="titleItem.id"
                    mini
                />
            </scroll>
            <UAlert v-else color="primary" variant="subtle">
                <template #description>
                    <ul class="related-links">
                        <li
                            v-for="link in title.related"
                            :key="link.id"
                            class="related-link"
                        >
                            <nuxt-link
                                :to="`/titles/${link.id}`"
                                class="related-link"
                            >
                                {{ link.name }}
                            </nuxt-link>
                        </li>
                    </ul>
                </template>
            </UAlert>
        </section>
        <section v-if="title.recommended.length" class="disable-padding">
            <div class="headline">
                <div class="title">Рекомендации</div>
            </div>
            <scroll padded buttonHeight="200px" buttonHeightBig="300px">
                <titles-card
                    :title="titleItem"
                    v-for="titleItem in title.recommended"
                    :key="titleItem.id"
                    mini
                />
            </scroll>
        </section>

        <section>
            <div class="headline">
                <div class="title">Скриншоты</div>
            </div>
            <Fancybox
                :options="{
                    Carousel: {
                        infinite: false,
                    },
                }"
                class="flex"
                v-if="title.shikimori.data && title.shikimori.data.screenshots"
            >
                <scroll>
                    <a
                        data-fancybox="gallery"
                        :href="screenshot.originalUrl"
                        v-for="screenshot in title.shikimori.data.screenshots"
                        class="gallery-item"
                    >
                        <img
                            :src="
                                screenshot.x332Url ||
                                screenshot.x166Url ||
                                screenshot.originalUrl
                            "
                        />
                    </a>
                </scroll>
            </Fancybox>
        </section>
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
const { currentEpisodes } = storeToRefs(playerStore);
const { logined } = storeToRefs(authStore);
const { title_id } = route.params;
const title = ref(await TitlesService.getTitleApiV1TitlesTitleIdGet(title_id));
const relatedModeSwitched = ref(true);
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
watch(currentEpisodes, (value) => {
    value.map((episode) => {
        const index = episodes.value.findIndex((e) => e.id === episode.id);
        if (index !== -1) {
            episodes.value[index] = episode;
        }
    });
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

const toggleFavorite = async () => {
    if (!logined.value) {
        loginModalActive.value = true;
        return;
    }
    if (title.value.liked) {
        await TitlesService.unfavoriteTitleApiV1TitlesFavoritesTitleIdDelete(
            title_id
        );
    } else {
        await TitlesService.favoriteTitleApiV1TitlesFavoritesTitleIdPost(
            title_id
        );
    }
    title.value.liked = !title.value.liked;
};

const otherParsers = computed(() => {
    const parsers = title.value.on_other_parsers.map((link) => ({
        ...link,
        parser_name: getParser(link.parser_id).name,
    }));
    if (parsers.length > 1) {
        parsers.unshift({
            parser_id: title.value.parser_id,
            parser_name: getParser(title.value.parser_id).name,
        });
    }

    return parsers;
});
const router = useRouter();
const selectedParser = computed(() =>
    otherParsers.value.find(
        (parser) => parser.parser_id === title.value.parser_id
    )
);
const goToTitle = (selected_title) => {
    if (selected_title.parser_id === title.value.parser_id) {
        return;
    }
    router.push({
        name: "titles-title_id",
        params: { title_id: selected_title.id },
    });
};
const viewport = useViewport();
const teleportButtonDisabled = computed(() => viewport.isGreaterThan("tablet"));
</script>
<style scoped lang="scss">
.gallery-item {
    height: min-content;
    min-width: 190px;
    cursor: pointer;
    width: min-content;
    @include md {
        min-width: 290px;
    }

    img {
        user-select: none;
        aspect-ratio: 16 / 9;
        border-radius: 10px;
        position: relative;
        overflow: hidden;
    }
}
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
    .head {
        grid-column: 1 / -1;

        @include md(true) {
            display: none;
        }
        display: flex;
        justify-content: space-between;
        gap: 5px;
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
            gap: 10px;
            @include md {
                margin-top: 10px;
                margin-bottom: 10px;
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
                font-weight: 300;
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
    section {
        grid-column: 1 / -1;
    }
    .alert,
    .desctiption {
        @include md(true) {
            padding: 0px 10px;
        }
    }

    section {
        display: flex;
        flex-direction: column;
        gap: 10px;

        @include lg(true) {
            overflow: hidden;
        }
        @include md(true) {
            max-width: 100vw;
            &:not(.disable-padding) {
                padding: 0px 10px;
            }
            &.disable-padding {
                .headline {
                    @include md(true) {
                        padding: 0px 10px;
                    }
                }
            }
        }

        .headline {
            display: flex;
            flex-direction: column;
            .title {
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 1.5rem;
                font-weight: 600;
                color: $primary-text;
            }
            .subtitle {
                font-size: 0.8rem;
                color: $secondary-text;
                font-weight: lighter;
            }
            .switch-view {
                cursor: pointer;
                svg {
                    width: 25px;
                    height: 25px;
                    color: $accent;
                }
                background-color: $tertiary-bg;
                padding: 8px;
                border-radius: 10px;
            }
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
        .more-episode {
            min-width: 200px;
            scroll-snap-align: end;

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
    .related-links {
        display: flex;
        flex-direction: column;
        list-style: circle;
        gap: 10px;
        padding-left: 20px;

        .related-link {
            color: $accent;
            li {
                font-size: 16px;
            }
            &:hover {
                text-decoration: underline;
            }
        }
    }
}
</style>
