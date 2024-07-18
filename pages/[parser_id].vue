<template>
    <div class="parser-page">
        <titles :titles="titlesData" />
        <UButton
            block
            size="lg"
            :loading="!loaded"
            color="amber"
            @click="fetchMore"
        >
            Загрузить еще
        </UButton>
    </div>
</template>
<script setup>
import { ParsersService } from "~/client";
const route = useRoute();
const { parser_id } = route.params;
const titlesData = ref(markRaw(Array.from({ length: 18 }, (_, i) => null)));
const page = ref(1);
const loaded = ref(false);
const fetchMore = async () => {
    if (!loaded.value) return;
    loaded.value = false;
    page.value++;
    const newPage = await ParsersService.getTitlesApiV1ParsersParserIdTitlesGet(
        parser_id,
        page.value
    );
    titlesData.value = [...titlesData.value, ...newPage.titles];
    loaded.value = true;
};
onMounted(async () => {
    const titlesPage =
        await ParsersService.getMainTitlesApiV1ParsersParserIdTitlesMainGet(
            parser_id
        );
    page.value = titlesPage.pages_on_main;
    titlesData.value = titlesPage.titles;
    loaded.value = true;
});
</script>
<style lang="scss">
.parser-page {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 10px;
}
</style>
