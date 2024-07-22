<template>
    <div class="selection-page-wrapper">
        <div :class="['selection-page', { 'show-aside': isBig }]">
            <div class="current-page" v-if="!isBig && !isIndex">
                <router-link :to="indexPath" class="back">
                    <Icon name="material-symbols:chevron-left" />
                </router-link>
                <div class="title">
                    {{ currentTitle }}
                </div>
            </div>
            <aside v-if="isBig ? true : isIndex">
                <selection-link
                    v-for="link in links"
                    :key="link.title"
                    :to="link.to"
                    :icon="link.icon"
                    @[link.onClick&&`click`]="link.onClick"
                >
                    {{ link.title }}
                </selection-link>
                <slot name="aside"></slot>
            </aside>
            <div class="page-content" v-if="!isBig ? !isIndex : true">
                <slot></slot>
            </div>
        </div>
    </div>
</template>
<script setup>
const { links, indexPath } = defineProps(["links", "indexPath"]);
const viewport = useViewport();
const isBig = computed(() => viewport.isGreaterThan("tablet"));
const router = useRouter();
const isIndex = computed(() => router.currentRoute.value.path === indexPath);
const currentTitle = computed(() => {
    const link = links.find(
        (link) => link.to === router.currentRoute.value.path
    );
    return link ? link.title : "";
});
</script>
<style scoped lang="scss">
.selection-page-wrapper {
    @include flex-center;
    height: 100%;
    padding: 0 20px;
    @include md(true) {
        padding: 10px;
    }
    .selection-page {
        background-color: $tertiary-bg;
        max-width: 1000px;
        width: 100%;
        display: grid;

        border-radius: 20px;
        overflow: hidden;
        min-height: 500px;

        .current-page {
            display: grid;
            grid-template-columns: min-content 1fr;
            gap: 10px;
            padding: 10px;
            border-bottom: 1px solid $quaternary-bg;

            .title {
                text-align: center;
                @include flex-center;
                font-size: 20px;
                color: $secondary-text;
            }

            .back {
                padding: 10px;
                @include flex-center;
                border-radius: 10px;
                background-color: $primary-bg;
                cursor: pointer;
                svg {
                    width: 24px;
                    height: 24px;
                }
            }
        }

        &.show-aside {
            grid-template-columns: 250px 1fr;
        }

        @include md(true) {
            border-radius: 10px;
            grid-template-columns: 1fr;
            grid-template-rows: min-content 1fr;
        }

        aside {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 20px;
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
