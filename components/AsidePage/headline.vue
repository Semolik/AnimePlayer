<template>
    <h1 class="headline__title">{{ title }}</h1>
</template>
<script setup>
const { title, subtitle, size } = defineProps({
    title: {
        type: String,
        default: null,
    },
    subtitle: {
        type: String,
        default: null,
    },
    size: {
        type: Number,
        default: 24,
    },
});
const sizeString = computed(() => {
    return `${size}px`;
});
</script>
<style lang="scss">
h1.headline__title {
    margin-bottom: 10px;
    font-size: v-bind(sizeString);
    font-weight: 500;
    color: $secondary-text;
}
</style>
