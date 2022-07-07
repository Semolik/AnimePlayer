<template>
    <MarqueeText :duration="titles.length * 3" :paused="hovered" v-on:mouseover="hovered = true" v-on:mouseleave="hovered = false">
        <div class="random_titles" v-if="titles">
            <ModuleRandomTitleItem v-for="(title, key) in titles" :titleData="title" :moduleId="this.moduleId"
                :key="key" />
        </div>
    </MarqueeText>
</template>

<script>
import { HTTP } from "../http-common.vue";
import ModuleRandomTitleItem from "./ModuleRandomTitleItem.vue";
import MarqueeText from 'vue-marquee-text-component'
export default {
    components: {
        ModuleRandomTitleItem,
        MarqueeText
    },
    props: {
        moduleId: String,
        setStatusCode: Function,
    },
    data() {
        return {
            titles: [],
            hovered: false,
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

<style scoped lang="scss">
@import "@/assets/breakpoints.scss";

.random_titles {
    display: flex;
    height: 300px;
    overflow: hidden;
    margin: 1rem 0px;
}
</style>
