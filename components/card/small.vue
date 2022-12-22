<template>
    <div class="small-card">
        <img :src="card.poster.url" alt="" />
    </div>
</template>
<script setup>
const { card } = defineProps({
    card: Object,
});
</script>
