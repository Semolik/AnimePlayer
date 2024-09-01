<template>
    <div class="history-page">
        <div class="headline">История</div>
        <div class="days">
            <div v-for="day in days" :key="day.date">
                <div class="day">
                    <div class="date">{{ day.date_label }}</div>
                    <div class="episodes">
                        <episode-card
                            class="episode-card"
                            v-for="episode in day.episodes"
                            :key="episode.id"
                            :episode="episode"
                            :title="episode.title"
                            more-info
                        />
                    </div>
                </div>
            </div>
        </div>
        <UButton
            block
            size="lg"
            :loading="!loaded"
            @click="fetchMore"
            v-if="!hideLoadMore && initialLoaded"
            class="mt-auto"
        >
            Загрузить еще
        </UButton>
    </div>
</template>
<script setup lang="ts">
import { EpisodesService, type HistoryDay } from "~/client";
definePageMeta({
    middleware: ["auth"],
});
const days = ref([] as HistoryDay[]);
const page = ref(0);
const loaded = ref(false);
const initialLoaded = ref(false);
const hideLoadMore = ref(false);
const fetchMore = async () => {
    page.value++;
    loaded.value = false;
    const data = await EpisodesService.getHistoryApiV1EpisodesHistoryGet(
        page.value
    );
    days.value = [...days.value, ...data];
    page.value++;
    if (!data.length) {
        hideLoadMore.value = true;
    }
    loaded.value = true;
};

for (let i = 0; i < 2; i++) {
    fetchMore();
}
initialLoaded.value = true;
</script>
<style lang="scss" scoped>
.history-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 20px;
    @include sm(true) {
        padding: 10px;
    }
    .headline {
        font-size: 30px;
        line-height: 32px;
        font-weight: 600;
        color: rgb(255, 255, 255);
    }

    .days {
        display: flex;
        flex-direction: column;
        gap: 15px;
        .day {
            display: flex;
            flex-direction: column;
            gap: 10px;
            .date {
                font-size: 20px;
                line-height: 24px;
                font-weight: 600;
                color: rgb(255, 255, 255);
            }

            .episodes {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }
        }
    }
}
</style>
