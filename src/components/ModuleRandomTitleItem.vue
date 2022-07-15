<template>
    <router-link :to="{ path: `/${this.moduleId}/title/${id}` }" class="random_title_card">
        <div v-bind:class="['random_title_card__poster_container', poster.blurhash ? 'canvas-blur' : '']">
            <img :src="poster.url" />
            <vue3-blurhash-canvas v-if="poster.blurhash" :hash="poster.blurhash" :height="10" :width="10" />
            <div class="info">
                <div class="rating" v-if="rating">
                    <font-awesome-icon icon="fa-solid fa-star" />
                    <div class="value">{{ rating }}</div>
                </div>
                <div class="title" v-snip="{ lines: 4 }">{{ ru_title }}</div>
                <div class="series_info">{{ series_info }}</div>
            </div>
        </div>

    </router-link>
</template>

<script>
import { Vue3BlurhashCanvas } from "vue3-blurhash";
import { library } from '@fortawesome/fontawesome-svg-core';

import { faStar } from '@fortawesome/free-solid-svg-icons';
library.add(faStar);
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
export default {
    components: {
        Vue3BlurhashCanvas,
        FontAwesomeIcon,
    },
    props: {
        titleData: Object,
        moduleId: String,
    },

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
@import "@/assets/breakpoints.scss";

.random_title_card {
    display: flex;
    height: 100%;
    margin: 0px 10px;
    overflow: hidden;
}

.random_title_card .random_title_card__poster_container {
    border-radius: 10px;
    height: 100%;
    width: 150px;
    aspect-ratio: 2 / 3;
    overflow: hidden;
    background-color: rgba(255, 255, 255, 0.1);
    display: flex;
    position: relative;
}

.random_title_card .random_title_card__poster_container .info {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    opacity: 0;
    color: var(--color-text);
    padding: 10px;
    transition: opacity .2s;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 3;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.random_title_card .random_title_card__poster_container .info .title {
    word-break: keep-all;
    height: min-content;
    margin: 5px 0px;
}


.random_title_card .random_title_card__poster_container .info {
    text-align: center;
}

.random_title_card .random_title_card__poster_container .info .series_info {
    text-align: center;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 7px;
    // margin-top: 10px;
}

.random_title_card .random_title_card__poster_container .info .rating {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 7px;
}

.random_title_card .random_title_card__poster_container .info .rating .value {
    margin-left: 5px;
}

@include sm {
    .random_title_card .random_title_card__poster_container.canvas-blur:hover img {
        opacity: 0;
    }

    .random_title_card .random_title_card__poster_container:not(.canvas-blur):hover img {
        filter: blur(20px);
    }

    .random_title_card .random_title_card__poster_container:hover .info {
        opacity: 1;
    }
}

.random_title_card .random_title_card__poster_container.canvas-blur img,
.random_title_card .random_title_card__poster_container.canvas-blur .info {
    transition: opacity .2s, filter .2s;
}

.random_title_card .random_title_card__poster_container img,
.random_title_card .random_title_card__poster_container .info {
    transition: opacity .3s, filter .3s;
}

.random_title_card .random_title_card__poster_container img {
    object-fit: cover;
    width: 100%;
    opacity: 1;
    height: 100%;
    z-index: 2;
}

.random_title_card .random_title_card__poster_container canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}
</style>
