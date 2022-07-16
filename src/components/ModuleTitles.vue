<template>
  <div class="titles-container" v-if="titles">
    <ModuleTitleItem v-for="(title, key) in titles" v-bind:is_mobile="is_mobile" :titleData="title" :moduleId="this.moduleId" :key="key" />
  </div>
</template>

<script>
import { HTTP } from "../http-common.vue";
import ModuleTitleItem from "./ModuleTitleItem.vue";
export default {
  components: {
    ModuleTitleItem,
  },
  props: {
    moduleId: String,
    setStatusCode: Function,
  },
  data() {
    const is_mobile = this.$isMobile();
    return {
      titles: [],
      pages: null,
      is_mobile: is_mobile,
    };
  },
  mounted() {
    HTTP.get(this.moduleId + "/")
      .then((response) => {
        const { titles, pages } = response.data;
        this.titles = titles;
        this.pages = pages;
      })
      .catch((error) => {
        console.log(error);
        this.setStatusCode(error.response.status);
      });
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/breakpoints.scss";

.titles-container {
  padding: 1rem;

  display: grid;
  max-width: calc(1200px + 2rem);
  gap: 10px;
  margin: 0 auto;

  @include xs {
    grid-template-columns: repeat(2, 1fr);
  }

  @include sm {
    grid-template-columns: repeat(3, 1fr);
  }

  @include md {
    grid-template-columns: repeat(4, 1fr);
  }

  @include lg {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>
