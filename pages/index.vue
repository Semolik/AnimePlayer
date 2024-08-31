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
        <section v-if="logined && currentEpisodes.length" v-auto-animate>
            <div class="section-head">
                <div class="section-name">Продолжить просмотр</div>
                <div class="scroll-buttons" v-if="showScrollButtons">
                    <div
                        :class="[
                            'scroll-button scroll-button-left',
                            { active: episodesList?.scrollLeftActive },
                        ]"
                        @click="episodesList.scrollLeft"
                    >
                        <Icon name="material-symbols:arrow-back-ios" />
                    </div>
                    <div
                        :class="[
                            'scroll-button scroll-button-right',
                            { active: episodesList?.scrollRightActive },
                        ]"
                        @click="episodesList.scrollRight"
                    >
                        <Icon name="material-symbols:arrow-forward-ios" />
                    </div>
                </div>
            </div>
            <episode-scroll
                :episodes="currentEpisodes"
                show-title-name
                show-close-button
                @close="(episode) => playerStore.removeEpisode(episode)"
                hide-controls
                ref="episodesList"
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
import { MessagesService } from "~/client";
import { useAuthStore } from "~/stores/auth";
import { useAppDataStore } from "~/stores/data";
import { usePlayerStore } from "~/stores/player";
useSeoMeta({
    title: "Главная",
    description: "Главная страница",
});
const { logined } = storeToRefs(useAuthStore());
const { parsers } = storeToRefs(useAppDataStore());

const playerStore = usePlayerStore();
const { currentEpisodes, isOpen } = storeToRefs(playerStore);

const episodesList = ref(null);
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
const { $viewport } = useNuxtApp();
const showScrollButtons = computed(
    () =>
        episodesList.value &&
        (episodesList.value.scrollLeftActive ||
            episodesList.value.scrollRightActive) &&
        $viewport.isGreaterThan("tablet")
);
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
        .section-head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 8px;

            .scroll-buttons {
                display: flex;
                gap: 8px;
                .scroll-button {
                    @include flex-center;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    background-color: $tertiary-bg;

                    transition: background-color 0.3s ease;
                    &.active {
                        background-color: $senary-bg;
                        cursor: pointer;
                        &:hover {
                            background-color: $septenary-bg;
                        }
                    }
                    &.scroll-button-left svg {
                        margin-left: 5px;
                    }

                    svg {
                        width: 15px;
                        height: 15px;

                        fill: $primary-text;
                    }
                }
            }
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
