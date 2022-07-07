<template>
    <router-link :to="{ path: `/${this.moduleId}/title/${id}` }" class="random_title_card">
        <div className="random_title_card__poster_container">

            <img :src="poster" />
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
            //   ru_title: data.ru_title,
            //   en_title: data.en_title,
            poster: data.poster,
            //   rating: data.rating,
            //   year: data.year,
            //   genre: data.genre,
            //   announce: data.announce,
            //   series_info: data.series_info,
            //   description: data.description,
            //   other_info: data.other_info,
        };
    },
};
</script>
<style>
.random_title_card {
    display: flex;
    width: 100%;
    margin: 0px 10px;
}

.random_title_card .random_title_card__poster_container {
    border-radius: 10px;
    overflow: hidden;
    /* aspect-ratio: 3 / 2; */
}
.random_title_card .random_title_card__poster_container img {
    object-fit: cover;
    width: 100%;
    height: 100%;
}
</style>
