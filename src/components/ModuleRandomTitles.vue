<template>
    <div :class="['random_titles', { loading: loading }]">
        <template v-if="loading">
            <ModuleRandomTitleItem v-for="(title, key) in Array(20).fill({})" v-bind:titleData="title" :key="key"
                v-bind:onlyLoading="true" />
        </template>
        <template v-else>
            <Flicking :plugins="plugins" :options="{ moveType: 'freeScroll', bound: true, circular: true }">
                <ModuleRandomTitleItem v-for="(title, key) in titles" v-bind:titleData="title" :key="key" />
            </Flicking>
        </template>

    </div>
</template>

<script>
import { HTTP } from "../http-common.vue";
import ModuleRandomTitleItem from "./ModuleRandomTitleItem.vue";
import Flicking from "@egjs/vue3-flicking";
import "@egjs/vue3-flicking/dist/flicking.css";
import { AutoPlay } from "@egjs/flicking-plugins";

export default {
    components: {
        ModuleRandomTitleItem,
        Flicking: Flicking,
    },
    inject: ['moduleId'],
    data() {
        const is_mobile = this.$isMobile();
        return {
            titles: [],
            hovered: false,
            plugins: [new AutoPlay({ duration: 800, direction: "NEXT", stopOnHover: !is_mobile })],
            loading: true,
        };
    },
    mounted() {
        this.loading = true;
        HTTP.get(this.moduleId + "/random")
            .then((response) => {
                this.titles = response.data;
            })
            .catch((error) => {
                this.$emit('error', error);
            }).finally(() => {
                this.loading = false;
            });
    },
};
</script>

<style scoped lang="scss">
.random_titles {
    display: flex;
    height: 200px;
    margin: 1rem 0px;

    &.loading {
        width: 10000px;
        overflow: hidden;
    }
}
</style>
