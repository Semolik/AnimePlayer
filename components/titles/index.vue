<template>
    <div class="cards">
        <titles-card :title="title" v-for="title in titles" :key="title.id" />
    </div>
</template>
<script setup>
defineProps({
    titles: Array,
});
</script>
<style lang="scss">
.cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
    gap: 16px;
}
</style>
