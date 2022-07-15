
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
    setLoading: Function,
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
      this.setLoading(true);
      HTTP.post("/index/autocomplete", {
        text: this.text,
      })
        .then((response) => {
          this.items = response.data.items || [];
        })
        .catch((error) => {
          console.log(error);
          this.items = [];
        })
        .finally(() => {
          this.setLoading(false);
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

