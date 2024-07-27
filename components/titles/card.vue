<template>
    <nuxt-link
        class="small-card"
        :to="title ? `/titles/${title.id}` : undefined"
    >
        <div :class="['picture', { loaded: image_loaded }]">
            <img :src="title.image_url" v-show="image_loaded" v-if="title" />
            <div class="placeholder animate-pulse bg-cool-700"></div>
            <div class="series-info" v-if="title">
                {{ title.additional_info }}
            </div>
        </div>
        <div class="title" v-if="title">{{ title.name }}</div>
        <div
            class="title-placeholder animate-pulse bg-cool-700 p-1.5 rounded-full"
            v-else
        ></div>
    </nuxt-link>
</template>
<script setup lang="ts">
import type { TitleShort } from "~/client";
const props = defineProps({
    title: {
        type: Object as PropType<TitleShort | null>,
        default: null,
    },
});

const image_loaded = ref(false);

onMounted(() => {
    watch(
        () => props.title,
        () => {
            image_loaded.value = false;
            if (!props.title) {
                return;
            }

            var image = new Image();
            image.src = props.title.image_url;
            image.onload = () => {
                image_loaded.value = true;
            };
        },
        { immediate: true }
    );
});
</script>
<style lang="scss">
.small-card {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 8px;
    cursor: pointer;
    margin-inline: auto;
    @include sm {
        &:hover {
            .picture {
                transform: translateY(-2%);
            }
            .title {
                color: $primary-text;
            }
        }
    }

    .picture {
        transition: transform 0.2s;
        aspect-ratio: 2 / 3;
        border-radius: 8px;
        overflow: hidden;
        position: relative;
        isolation: isolate;
        &::after {
            content: "";
            position: absolute;
            inset: 0;
            z-index: 2;
        }
        img {
            z-index: 1;
            width: 100%;
            height: 100%;
            object-fit: cover;
            user-select: none;
        }
        .placeholder {
            position: absolute;
            inset: 0;
        }
        &.loaded {
            .placeholder {
                opacity: 0 !important;
            }
        }
        .series-info {
            position: absolute;
            top: 1rem;
            right: 0;
            max-width: 80%;
            padding: 5px 10px;
            background: $accent;
            border-radius: 10px 0 0 10px;
            color: black;

            &:empty {
                display: none;
            }
        }
    }

    .title {
        text-align: center;
        color: $secondary-text;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>
