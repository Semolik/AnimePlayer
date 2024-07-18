<template>
    <nuxt-link :to="to" class="selection-link">
        <Icon :name="icon" />
        <span>
            <slot></slot>
        </span>
    </nuxt-link>
</template>
<script setup>
defineProps({
    to: String,
    icon: String,
});
</script>
<style scoped lang="scss">
.selection-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border-radius: 10px;
    background-color: $primary-bg;
    cursor: pointer;
    transition: background-color 0.2s;

    span {
        font-size: 16px;
    }
    color: $secondary-text;
    &.router-link-exact-active {
        background-color: $accent;
        color: $primary-reverse-text;
    }
}
</style>
