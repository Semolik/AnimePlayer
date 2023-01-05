<template>
    <nuxt-link :is="to ? 'nuxt-link' : 'div'" :to="to" class="aside-item">
        <slot></slot>
    </nuxt-link>
</template>
<script setup>
const { to } = defineProps({
    to: {
        type: String,
        default: null,
    },
});
</script>
<style lang="scss">
.aside-item {
    @include flex-center;
    gap: 10px;
    padding: 8px 16px;
    min-width: 250px;
    border-radius: 10px;
    cursor: pointer;
    text-decoration: none;
    &.router-link-exact-active {
        background-color: $tertiary-bg;
        span {
            color: $primary-text;
        }
        svg {
            color: $primary-text;
        }
    }
    &:not(.router-link-exact-active):hover {
        background-color: $tertiary-bg;
        span {
            color: $secondary-text;
        }
        svg {
            color: $secondary-text;
        }
    }

    span {
        color: $secondary-text;
        flex-grow: 1;
    }
    svg {
        width: 20px;
        height: 20px;
        color: $secondary-text;
    }
}
</style>
