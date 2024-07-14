<template>
    <titles :titles="titlesData" :as-placeholder="loading" />
</template>
<script setup>
import { ParsersService } from "~/client";
const { parserId } = defineProps({
    parserId: {
        type: String,
        required: true,
    },
});
const loading = ref(true);
const titlesData = ref(
    markRaw(Array.from({ length: 16 }, (_, i) => ({ id: i })))
);

onMounted(async () => {
    const page =
        await ParsersService.getMainTitlesApiV1ParsersParserIdTitlesMainGet(
            parserId
        );
    titlesData.value = page.titles;
    loading.value = false;
});
</script>
