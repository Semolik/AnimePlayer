<template>
    <div class="selection-page-wrapper">
        <div class="selection-page">
            <aside>
                <slot name="aside"></slot>
            </aside>
            <div class="page-content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
.selection-page-wrapper {
    @include flex-center;
    height: 100%;
    padding: 0 20px;

    .selection-page {
        background-color: $tertiary-bg;
        max-width: 1200px;
        width: 100%;
        display: grid;
        grid-template-columns: 250px 1fr;
        border-radius: 20px;
        padding: 20px;
        gap: 20px;
        min-height: 500px;

        aside {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
    }
}
</style>
