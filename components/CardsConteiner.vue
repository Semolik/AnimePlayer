<template>
    <div class="cards-container">
        <slot></slot>
    </div>
</template>
<style lang="scss">
.cards-container {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}
</style>
