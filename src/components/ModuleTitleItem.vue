<template>
  <router-link :to="{ path: `/${this.moduleId}/title/${id}` }" class="title__card" @mouseover.native="handlemouseover"
    @mousemove.native="handlemousemove" @mouseleave.native="handlemouseleave">
    <div className="poster-container">
      <div v-if="announce" className="announce">Анонс</div>
      <div v-if="series_info" className="series-info">{{ series_info }}</div>
      <img :src="poster.url" :alt="ru_title" />
      <vue3-blurhash-canvas v-if="poster.blurhash" :hash="poster.blurhash || ''" :height="10" :width="10" />
    </div>
    <div className="title" v-snip="{ lines: 2 }">
      {{ ru_title }}
    </div>
    <div class="qtip" v-if="hovered && qtip_position"
      v-bind:style="{ top: qtip_position.y + 'px', left: qtip_position.x + 'px' }">
      {{ ru_title }}</div>
  </router-link>
</template>

<script>
import { Vue3BlurhashCanvas } from "vue3-blurhash";
export default {
  components: {
    Vue3BlurhashCanvas,
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
      en_title: data.en_title,
      poster: data.poster,
      rating: data.rating,
      year: data.year,
      genre: data.genre,
      announce: data.announce,
      series_info: data.series_info,
      description: data.description,
      other_info: data.other_info,

      qtip_position: false,
      hovered: false,
      timeout: null,
    };
  },
  methods: {
    handlemousemove(event) {
      if (!this.hovered || !this.qtip_position) {
        this.qtip_position = { x: event.layerX, y: event.layerY };
      }
    },
    handlemouseover() {
      this.timeout = setTimeout(() => { this.hovered = true }, 300);
    },
    handlemouseleave() {
      clearTimeout(this.timeout);
      this.qtip_position = false;
      this.hovered = false;

    }
  }
};
</script>
<style lang="scss">
@import "@/assets/breakpoints.scss";

.title__card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: var(--text-color);
  height: min-content;
  position: relative;
}

.title__card .qtip {
  position: absolute;
  z-index: 9;
  background-color: #006dd1;
}

.title__card .title {
  color: #d9d7e0;
  width: 100%;
  margin: 0.5rem;
  transition: color 0.2s;
}

.title__card .poster-container {
  position: relative;
  display: flex;
  width: 100%;
  aspect-ratio: 0.7;
  transition: transform 0.2s;
  border-radius: 10px;
  overflow: hidden;
}


.title__card .poster-container .announce {
  position: absolute;
  padding: 2px 5px;
  border-bottom-right-radius: 10px;
  background-color: #01c03a;
}

@include sm {
  .title__card:hover .poster-container {
    transform: translateY(-5px);
  }

  .title__card:hover .title {
    color: white;
  }
}

.title__card .poster-container canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.title__card .poster-container img {
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.title__card .poster-container .series-info {
  position: absolute;
  bottom: 1rem;
  right: 0;
  max-width: 80%;
  padding: 5px 10px;
  background: #006dd1;
  border-radius: 10px 0px 0px 10px;
  color: white;
}
</style>
