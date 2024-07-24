<template>
    <div class="title-page">
        <div class="picture">
            <img :src="title.image_url" :alt="title.name" />
        </div>
        <div class="page-content">
            <div class="names">
                <div class="name">{{ title.name }}</div>
                <div class="en_title" v-if="title.en_name">
                    {{ title.en_name }}
                </div>
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
                    :to="`/genres/${genre.id}`"
                    class="genre"
                >
                    {{ genre.name }}
                </nuxt-link>
            </div>
            <div class="desctiption">
                {{ title.description }}
            </div>
        </div>
    </div>
</template>
<script setup>
import { TitlesService } from "~/client";
const route = useRoute();
const siteConfig = useSiteConfig();
const { title_id } = route.params;
const title = await TitlesService.getTitleApiV1TitlesTitleIdGet(title_id);
useSeoMeta({
    title: title.name,
    description: title.description,
});
defineOgImageComponent("title", {
    title: title.name,
    image: title.image_url,
    description: title.description,
    link: new URL(siteConfig.url).host,
});
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
    }
    .picture {
        overflow: hidden;
        @include lg(true) {
            max-height: 450px;
        }
        @include sm(true) {
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
        }

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    .page-content {
        display: flex;
        flex-direction: column;
        gap: 10px;
        @include md(true) {
            padding: 10px;
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
                margin-bottom: 30px;
                @include lg(true) {
                    margin-bottom: 20px;
                }
            }
            @include md(true) {
                padding: 10px;
                padding-top: 0px;
                text-align: center;
                gap: 10px;
                .name {
                    font-size: 2rem;
                }
                .en_title {
                    font-size: 0.9rem;
                }
            }
            .name {
                color: $primary-text;
                font-size: 2.5rem;
                line-height: 35px;
            }

            .en_title {
                color: $secondary-text;
                margin-left: 5px;
            }
        }

        .info {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            .item {
                @include sm(true) {
                    flex-grow: 1;
                }
                display: flex;
                gap: 10px;
                align-items: center;
                background-color: $quaternary-bg;
                padding: 5px 10px;
                border-radius: 10px;

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
                svg {
                    width: 35px;
                    height: 35px;
                    color: $accent;
                }
            }
        }
    }
}
</style>
