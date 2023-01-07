<template>
    <div
        :class="[
            'button',
            { active: active },
            { 'highlight-active': highlightActive },
        ]"
        @click="handleClick(active)"
    >
        <slot></slot>
    </div>
</template>
<script setup>
const { active } = defineProps({
    active: {
        type: Boolean,
        default: true,
    },
    highlightActive: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits(["clicked"]);
const handleClick = (active) => {
    if (active) {
        emit("clicked");
    }
};
</script>
<style lang="scss">
@use "@/assets/styles/breakpoints";
.button {
    &.active {
        cursor: pointer;
        &.highlight-active {
            background-color: $quaternary-bg;
            color: $primary-text;
            &:hover {
                background-color: $quinary-bg;
                color: $primary-text;
            }
        }
        &:not(.highlight-active) {
            @include breakpoints.md {
                &:hover {
                    background-color: $quaternary-bg;
                    color: $primary-text;
                }
            }
        }
    }
    user-select: none;
    color: $secondary-text;
    background-color: $tertiary-bg;
    padding: 10px 20px;
    border-radius: 5px;
    transition: all 0.2s ease-in-out;
    text-align: center;
}
</style>
