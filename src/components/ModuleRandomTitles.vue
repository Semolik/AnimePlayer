<template>
    <div class="random_titles" v-if="titles">
        <Flicking :plugins="plugins" :options="{ moveType: 'freeScroll', bound: true, circular: true }">
            <ModuleRandomTitleItem v-bind:is_mobile="is_mobile" v-for="(title, key, index) in titles" :titleData="title" :moduleId="this.moduleId"
                :key="key" />
        </Flicking>
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
    props: {
        moduleId: String,
        setStatusCode: Function,
    },
    data() {
        const is_mobile = this.$isMobile();
        return {
            titles: [],
            hovered: false,
            plugins: [new AutoPlay({ duration: 800, direction: "NEXT", stopOnHover: !is_mobile })],
            is_mobile: is_mobile,
        };
    },
    mounted() {

        HTTP.get(this.moduleId + "/random")
            .then((response) => {
                this.titles = response.data;
            })
            .catch((error) => {
                this.setStatusCode(error.response.status);
            });
    },
};
</script>

<style scoped>
.random_titles {
    display: flex;
    height: 200px;
    margin: 1rem 0px;
}
</style>
