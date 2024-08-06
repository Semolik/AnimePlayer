<template>
    <div class="cards">
        <titles-card
            :title="title"
            v-for="(title, index) in titles"
            :key="index"
            :class="cardClass"
        />
    </div>
</template>
<script setup>
defineProps({
    titles: Array,
    cardClass: {
        type: String,
        default: "",
    },
});
</script>
<style lang="scss">
.cards {
    display: grid;
    gap: 10px;
    row-gap: 20px;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));

    @include md {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    }
}
</style>
