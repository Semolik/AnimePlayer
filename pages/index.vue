<template>
    <div class="index-page">
        <div class="messages" v-if="filteredMessages.length">
            <UAlert
                :color="message.color || 'primary'"
                variant="subtle"
                class="message"
                :description="message.content"
                v-for="message in filteredMessages"
                :close-button="{
                    icon: 'i-heroicons-x-mark-20-solid',
                    color: 'gray',
                    variant: 'link',
                    padded: false,
                }"
                @close="hideMessage(message)"
            >
                <template #description="{ description }">
                    <span v-html="description" />
                </template>
            </UAlert>
        </div>
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
import { EpisodesService, MessagesService } from "~/client";
import { useAuthStore } from "~/stores/auth";
import { useAppDataStore } from "~/stores/data";
useSeoMeta({
    title: "Главная",
    description: "Главная страница",
});
const { logined } = storeToRefs(useAuthStore());
const { parsers } = storeToRefs(useAppDataStore());
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

const messages = await MessagesService.getMessagesApiV1MessagesGet();
const hidedMessages = useLocalStorage("hidedMessages", []);
const filteredMessages = ref([]);
onMounted(() => {
    filteredMessages.value = messages.filter(
        (message) => !hidedMessages.value.includes(message.id)
    );
});
const hideMessage = (message) => {
    hidedMessages.value.push(message.id);
    filteredMessages.value = messages.filter(
        (message) => !hidedMessages.value.includes(message.id)
    );
};
</script>

<style lang="scss">
.index-page {
    display: flex;
    flex-direction: column;
    gap: 16px;
    .messages {
        @include md(true) {
            padding: 10px;
        }
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
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
