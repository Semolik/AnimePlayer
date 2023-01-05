<template>
    <div class="disabled-label status-label">
        <Icon name="material-symbols:cancel" class="text-red-500" />
        <span class="text-red-500">{{ text }}</span>
    </div>
</template>
<script setup>
const { text } = defineProps({
    text: {
        type: String,
        default: "Отключено",
    },
});
</script>
<style lang="scss">
.disabled-label {
    display: flex;
    gap: 5px;
    align-items: center;

    svg {
        width: 20px;
        height: 20px;
    }
}
</style>
