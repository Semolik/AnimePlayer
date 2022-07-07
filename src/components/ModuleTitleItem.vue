<template>
  <router-link :to="{ path: `/${this.moduleId}/title/${id}` }" class="title__card">
    <div className="poster-container">
      <div v-if="announce" className="announce">Анонс</div>
      <div v-if="series_info" className="series-info">{{ series_info }}</div>
      <img :src="poster" :alt="ru_title" />
    </div>
    <div className="title" v-snip="{ lines: 2 }">
      {{ ru_title }}
    </div>
  </router-link>
</template>

<script>
export default {
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
    };
  },
};
</script>
<style>
.title__card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: var(--text-color);
  height: min-content;
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
.title__card .poster-container:hover {
  transform: translateY(-5px);
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
