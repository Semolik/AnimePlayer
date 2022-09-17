<template>
  <router-link :to="!onlyLoading ? { path: `/${this.moduleId}/title/${id}` } : {}"
    :class="['title__card', $isMobile() ? '' : 'desktop']">
    <div class="poster-container">
      <template v-if="!onlyLoading">
        <div v-if="announce" class="announce">Анонс</div>
        <div v-if="series_info" class="series-info">{{ series_info }}</div>
        <vue3-blurhash-canvas v-if="poster && poster.blurhash" :hash="poster.blurhash || ''" :height="10" :width="10" />
        <vue-load-image>
          <template v-slot:image>
            <img :src="poster.url" v-if="poster && poster.url" :alt="ru_title" />
          </template>
          <template v-slot:preloader>
            <Skeletor slot="preloader" size="100%" />
          </template>
        </vue-load-image>
      </template>
      <template v-else>
        <Skeletor slot="preloader" size="100%" />
      </template>
    </div>
    <div :class="['title', { 'loader': onlyLoading }]">
      <template v-if="onlyLoading">
        <Skeletor slot="preloader" width="100%" />
        <Skeletor slot="preloader" width="80%" />
      </template>
      <template v-else>
        {{ ru_title }}
      </template>
    </div>
  </router-link>
</template>

<script>
import { Vue3BlurhashCanvas } from "vue3-blurhash";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStar } from '@fortawesome/free-solid-svg-icons';
library.add(faStar);
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Skeletor } from 'vue-skeletor';
import 'vue-skeletor/dist/vue-skeletor.css';
import VueLoadImage from 'vue-load-image';

export default {
  components: {
    Vue3BlurhashCanvas,
    FontAwesomeIcon,
    Skeletor,
    VueLoadImage
  },
  props: {
    titleData: Object,
    onlyLoading: Boolean,
  },
  inject: ['moduleId'],
  data() {
    return {
      id: null,
      ru_title: null,
      en_title: null,
      poster: null,
      rating: null,
      year: null,
      genre: null,
      announce: null,
      series_info: null,
      description: null,
      other_info: null,

    };
  },
  updated() {
    const data = this.titleData;
    if (data) {
      this.id = data.id;
      this.ru_title = data.ru_title;
      this.en_title = data.en_title;
      this.poster = data.poster;
      this.rating = data.rating;
      this.year = data.year;
      this.genre = data.genre;
      this.announce = data.announce;
      this.series_info = data.series_info;
      this.description = data.description;
      this.other_info = data.other_info;
    }
  },
};
</script>
<style lang="scss">
@use "@/assets/styles/text";

.title__card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: var(--color-text);
  height: min-content;
  position: relative;
  width: 100%;

  .title {
    color: var(--color-text);
    margin: 10px;
    transition: color 0.2s;
    @include text.snip-text(2);

    &.loader {
      margin: 10px 5px;
      display: grid;
      gap: 5px;

      .vue-skeletor {
        border-radius: 5px;
        height: 13px;
      }
    }
  }

  &.desktop:hover {
    .poster-container {
      transform: translateY(-5px);
    }

    &:active .poster-container {
      transform: scale(99%);
    }
  }

  .poster-container {
    position: relative;
    display: flex;
    width: 100%;
    aspect-ratio: 0.7;
    transition: transform 0.2s;
    border-radius: 10px;
    overflow: hidden;

    .announce {
      position: absolute;
      padding: 2px 5px;
      border-bottom-right-radius: 10px;
      background-color: #01c03a;
    }

    .vue-load-image,
    canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .vue-load-image {
      z-index: -1;
    }

    canvas {
      z-index: -2;
    }

    img {
      height: 100%;
      object-fit: cover;
      width: 100%;
    }

    .series-info {
      position: absolute;
      bottom: 1rem;
      right: 0;
      max-width: 80%;
      padding: 5px 10px;
      background: #006dd1;
      border-radius: 10px 0px 0px 10px;
      color: white;
    }
  }
}
</style>
