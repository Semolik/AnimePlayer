<script>
import AutocompleteItem from "./AutocompleteItem.vue";
export default {
  components: {
    AutocompleteItem,
  },
  props: {
    moduleData: Object,
  },
};
</script>

<template>
  <div class="module">
    <div class="name">{{ this.moduleData.module_name }}</div>
    <div class="titles">
      <AutocompleteItem v-for="(item, i) in this.moduleData.titles" v-bind:data="item"
        v-bind:module_id="this.moduleData.module_id" :key="i" />
    </div>
  </div>
</template>
<style scoped lang="scss">
@use "@/assets/styles/breakpoints";

.module {
  padding: 10px 0;
  display: flex;
  flex-direction: column;

  .name {
    color: var(--color-border-hover);
    margin-bottom: 5px;
    padding-left: 10px;
  }

  .titles {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;

    @include breakpoints.sm {
      grid-template-columns: repeat(2, 1fr);
    }

  }
}

// .module 
</style>
