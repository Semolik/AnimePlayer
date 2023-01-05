<template>
    <div class="aside-page-container">
        <div class="aside-page-wrapper">
            <aside>
                <slot name="aside"></slot>
            </aside>
            <main>
                <slot name="content"></slot>
            </main>
        </div>
    </div>
</template>
<style lang="scss">
.aside-page-container {
    width: 100%;
    height: 100%;
    padding-top: 20vh;
    display: flex;
    justify-content: center;
    height: min-content;
    .aside-page-wrapper {
        display: flex;
        width: 100%;
        max-width: 1200px;
        background-color: $secondary-bg;
        border-radius: 15px;
        overflow: hidden;
        aside {
            background-color: $secondary-2-bg;
            padding: 10px;
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        main {
            width: 100%;
            padding: 16px;
            @include sm(true) {
                padding: 0;
            }
        }
    }
}
</style>
