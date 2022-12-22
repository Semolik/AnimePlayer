<template>
    <div class="popular-container">
        <CardSmall v-for="card in data.titles" :card="card" />
    </div>
</template>
<script setup>
const { data } = await useFetch(
    "http://localhost:8000/animevost/?sort_by=rating&reverse_sort=false&page=1"
);
</script>
