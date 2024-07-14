<template>
    <div class="cards">
        <titles-card
            :title="title"
            v-for="(title, index) in titles"
            :key="index"
            :as-placeholder="asPlaceholder"
        />
    </div>
</template>
<script setup>
defineProps({
    titles: Array,
    asPlaceholder: Boolean,
});
</script>
<style lang="scss">
.cards {
    display: grid;
    gap: 10px;
    row-gap: 20px;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    @include sm {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    }
}
</style>
