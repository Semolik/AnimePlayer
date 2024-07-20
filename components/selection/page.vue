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
        max-width: 1000px;
        width: 100%;
        display: grid;
        grid-template-columns: 250px 1fr;
        border-radius: 30px;
        overflow: hidden;
        min-height: 500px;
        @include lg(true) {
            grid-template-columns: min-content 1fr;
        }
        @include md(true) {
            grid-template-columns: 1fr;
        }

        aside {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 20px;
            @include md(true) {
                flex-direction: row;
            }
        }

        .page-content {
            display: flex;
            flex-direction: column;
            gap: 20px;
            padding: 20px;
            background-color: $quaternary-bg;
        }
    }
}
</style>
