<template>
    <div :class="['button', { active: active }]" @click="handleClick">
        <slot></slot>
    </div>
</template>
<script setup>
const { active } = defineProps({
    active: {
        type: Boolean,
        default: true,
    },
});
const handleClick = () => {
    if (active) {
        $emit("clicked");
    }
};
</script>
<style lang="scss">
@use "@/assets/styles/breakpoints";
.button {
    &.active {
        background-color: $tertiary-bg;
        @include breakpoints.md {
            &:hover {
                background-color: $quaternary-bg;
            }
        }
    }
    color: $primary-text;
    background-color: $primary-text;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    text-align: center;
}
</style>
