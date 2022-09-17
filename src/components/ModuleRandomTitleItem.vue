<template>
    <router-link :to="onlyLoading ? {} : { path: `/${this.moduleId}/title/${id}` }"
        :class="['random_title_card', $isMobile() ? '' : 'desktop']">
        <div v-bind:class="['random_title_card__poster_container', (poster && poster.blurhash) ? 'canvas-blur' : '']">
            <template v-if="onlyLoading">
                <Skeletor slot="preloader" size="100%" />
            </template>
            <template v-else>
                <img :src="poster.url" />
                <vue3-blurhash-canvas v-if="poster.blurhash" :hash="poster.blurhash" :height="10" :width="10" />
                <div class="info">
                    <div class="rating" v-if="rating">
                        <font-awesome-icon icon="fa-solid fa-star" />
                        <div class="value">{{ rating }}</div>
                    </div>
                    <div class="title">{{ ru_title }}</div>
                    <div class="series_info">{{ series_info }}</div>
                </div>
            </template>
        </div>

    </router-link>
</template>

<script>
import { Vue3BlurhashCanvas } from "vue3-blurhash";
import { Skeletor } from 'vue-skeletor';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStar } from '@fortawesome/free-solid-svg-icons';
library.add(faStar);
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
export default {
    components: {
        Vue3BlurhashCanvas,
        FontAwesomeIcon,
        Skeletor,
    },
    props: {
        titleData: Object,
        onlyLoading: Boolean,
    },
    inject: ['moduleId'],
    data() {
        const data = this.titleData;
        return {
            id: data.id,
            ru_title: data.ru_title,
            //   en_title: data.en_title,
            poster: data.poster,
            rating: data.rating,
            //   year: data.year,
            //   genre: data.genre,
            //   announce: data.announce,
            series_info: data.series_info,
            //   description: data.description,
            //   other_info: data.other_info,
        };
    },
};
</script>
<style lang="scss">
@use "@/assets/styles/text";

.random_title_card {
    display: flex;
    height: 100%;
    margin: 0px 10px;
    overflow: hidden;

    &.desktop {
        .random_title_card__poster_container:hover {
            img {
                filter: blur(20px);
            }

            .info {
                opacity: 1;
            }
        }
    }

    .random_title_card__poster_container {
        border-radius: 10px;
        height: 100%;
        width: 150px;
        aspect-ratio: 2 / 3;
        overflow: hidden;
        background-color: rgba(255, 255, 255, 0.1);
        display: flex;
        position: relative;

        &.canvas-blur {
            &:hover img {
                opacity: 0;
                filter: none;
            }

            img,
            .info {
                transition: opacity .2s, filter .2s;
            }
        }

        img,
        .info {
            transition: opacity .2s, filter .2s;
        }

        img {
            object-fit: cover;
            width: 100%;
            opacity: 1;
            height: 100%;
            z-index: 2;
        }

        .info,
        canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        canvas {
            z-index: 1;
        }

        .info {
            opacity: 0;
            color: var(--color-text);
            padding: 10px;
            transition: opacity .2s;
            background-color: rgba(0, 0, 0, 0.3);
            z-index: 3;
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;

            .title {
                overflow-wrap: break-word;
                height: min-content;
                margin: 5px 0px;
                @include text.snip-text(6);
            }

            .series_info {
                text-align: center;
                background-color: rgba(255, 255, 255, 0.2);
                border-radius: 7px;
            }

            .rating {
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: rgba(255, 255, 255, 0.2);
                border-radius: 7px;

                .value {
                    margin-left: 5px;
                }
            }
        }
    }
}
</style>
