
<template>
  <AutocompleteModuleItem v-for="(item, i) in this.items" v-bind:moduleData="item" v-bind:key="i" />
</template>

<script>
import { HTTP } from "../http-common.vue";

import AutocompleteModuleItem from "./AutocompleteModuleItem.vue";

export default {
  components: {
    AutocompleteModuleItem,
  },
  props: {
    text: String,
  },
  data() {
    return {
      items: [],

    };
  },
  methods: {
    search() {
      if (!this.text) {
        this.items = [];
        return;
      }
      this.$emit('loading', true);
      HTTP.post("/index/autocomplete", {
        text: this.text,
      })
        .then((response) => {
          this.items = response.data.items || [];
        })
        .catch((error) => {
          this.$emit('error', error);
          this.items = [];
        })
        .finally(() => {
          this.$emit('loading', false);
        });
    },
  },
  watch: {
    text() {
      this.search();

    },
  },
};
</script>

