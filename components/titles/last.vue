<template>
    <titles :titles="titlesPage.titles" />
</template>
<script setup>
import { ParsersService } from "~/client";
const { parserId } = defineProps({
    parserId: {
        type: String,
        required: true,
    },
});
const titlesPage = await ParsersService.getTitlesApiV1ParsersParserIdTitlesGet(
    parserId,
    1
);
</script>
