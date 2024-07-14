<template>
    <nuxt-link class="small-card">
        <div :class="['picture', { loaded: image_loaded }]">
            <img
                :src="title.image_url"
                @load="image_loaded = true"
                v-show="image_loaded"
                v-if="!asPlaceholder"
            />

            <div class="placeholder animate-pulse bg-cool-700"></div>
        </div>
        <div class="title" v-if="!asPlaceholder">{{ title.name }}</div>
        <div
            class="title-placeholder animate-pulse bg-cool-700 p-1.5 rounded-full"
            v-else
        />
    </nuxt-link>
</template>
<script setup>
const props = defineProps({
    title: Object,
    asPlaceholder: Boolean,
});
const image_loaded = ref(false);
watch(
    () => props.title,
    () => {
        image_loaded.value = false;
        var image = new Image();
        image.src = props.title.image_url;
        image.onload = () => {
            image_loaded.value = true;
        };
    }
);
</script>
<style lang="scss">
.small-card {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 8px;
    cursor: pointer;
    margin-inline: auto;
    .picture {
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
    &:hover {
        .title {
            color: $primary-text;
        }
    }
}
</style>
