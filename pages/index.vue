<template>
    <div class="index-page">
        <section v-if="logined && lastEpisodes.length" v-auto-animate>
            <div class="section-name">Продолжить просмотр</div>
            <episode-scroll
                :episodes="lastEpisodes"
                show-title-name
                show-close-button
                @close="removeEpisode"
            />
        </section>
        <section v-for="parser in parsers">
            <nuxt-link
                class="section-name"
                :to="{ name: 'parser', query: { parser_id: parser.id } }"
            >
                {{ parser.name }}
                <Icon name="material-symbols:arrow-forward-ios-rounded" />
            </nuxt-link>
            <titles-last :parserId="parser.id" />
        </section>
    </div>
</template>

<script setup>
import { ParsersService, EpisodesService } from "~/client";
import { useAuthStore } from "~/stores/auth";
const { logined } = storeToRefs(useAuthStore());
const parsers = await ParsersService.getParsersApiV1ParsersGet();
const lastEpisodes = ref([]);
const removeEpisode = async (episode) => {
    await EpisodesService.unsetEpisodeProgressApiV1EpisodesEpisodeIdProgressDelete(
        episode.id
    );
    const index = lastEpisodes.value.findIndex((e) => e.id === episode.id);
    if (index !== -1) {
        lastEpisodes.value.splice(index, 1);
    }
};
watch(
    () => logined.value,
    async (value) => {
        if (!value) {
            return;
        }
        lastEpisodes.value =
            await EpisodesService.getEpisodesApiV1EpisodesGet();
    },
    { immediate: true }
);
useSeoMeta({
    title: "Главная",
    description: "Главная страница",
});
</script>

<style lang="scss">
.index-page {
    display: flex;
    flex-direction: column;
    gap: 16px;

    section {
        display: flex;
        flex-direction: column;
        gap: 8px;

        @include sm(true) {
            gap: 0;
        }
        .section-name {
            font-size: 24px;
            line-height: 32px;
            font-weight: 600;
            color: $primary-text;
            display: flex;
            align-items: center;
            gap: 8px;
            @include sm(true) {
                padding: 10px 15px;
                svg {
                    margin-left: auto;
                }
            }
            svg {
                margin-top: 2px;
                width: 18px;
                height: 18px;
                fill: $primary-text;
                transition: transform 0.3s ease;
                color: $secondary-text;
            }

            &:hover {
                @include sm {
                    svg {
                        transform: translateX(4px);
                    }
                }
            }
        }
    }
}
</style>
