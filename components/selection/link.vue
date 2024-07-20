<template>
    <component :to="to" class="selection-link" :is="to ? 'router-link' : 'div'">
        <Icon :name="icon" />
        <span>
            <slot></slot>
        </span>
    </component>
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
    white-space: nowrap;
    background-color: $primary-bg;
    cursor: pointer;
    transition: background-color 0.2s, outline 0.2s;
    color: $secondary-text;
    &:not(:focus-visible) {
        outline: 1px solid transparent;
    }
    &.router-link-exact-active {
        background-color: $accent;
        color: $primary-reverse-text;
    }

    &:not(.router-link-exact-active):hover {
        outline: 1px solid $accent-hover;
    }

    svg {
        width: 24px;
        height: 24px;
    }

    @include md(true) {
        span {
            display: none;
        }
    }
}
</style>
