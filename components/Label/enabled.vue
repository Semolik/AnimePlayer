<template>
    <div class="enabled-label status-label">
        <Icon name="material-symbols:check-circle" class="text-lime-500" />
        <span class="text-lime-500">Активно</span>
    </div>
</template>
<style lang="scss">
.enabled-label {
    display: flex;
    gap: 5px;
    align-items: center;

    svg {
        width: 20px;
        height: 20px;
    }
}
</style>
