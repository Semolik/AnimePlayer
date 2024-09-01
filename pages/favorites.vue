<template>
    <div class="favorites-page">
        <div class="headline">Избранное</div>
        <titles :titles="titlesData" />
        <UButton
            block
            size="lg"
            :loading="!loaded"
            @click="fetchMore"
            v-if="!hideLoadMore"
        >
            Загрузить еще
        </UButton>
    </div>
</template>
<script setup>
import { TitlesService } from "~/client";
definePageMeta({
    middleware: ["auth"],
});

const titlesData = ref(
    await TitlesService.getFavoriteTitlesApiV1TitlesFavoritesGet(1)
);

const page = ref(0);
const loaded = ref(false);
const hideLoadMore = ref(titlesData.value.length < 30);

const fetchMore = async () => {
    loaded.value = false;
    const data = await TitlesService.getFavoriteTitlesApiV1TitlesFavoritesGet(
        page.value + 1
    );
    titlesData.value = [...titlesData.value, ...data];
    page.value++;
    if (data.length < 30) {
        hideLoadMore.value = true;
    }
    loaded.value = true;
};
</script>
<style lang="scss" scoped>
.favorites-page {
    display: flex;
    flex-direction: column;
    gap: 15px;
    @include sm(true) {
        padding: 10px;
    }
    .headline {
        font-size: 30px;
        line-height: 32px;
        font-weight: 600;
        color: rgb(255, 255, 255);
    }
}
</style>
