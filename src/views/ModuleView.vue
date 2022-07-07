<template>
  <ModuleRandomTitles v-if="moduleId && !errored" v-bind:moduleId="moduleId" v-bind:setStatusCode="setStatusCode" />
  <ModuleTitles v-if="moduleId && !errored" v-bind:moduleId="moduleId" v-bind:setStatusCode="setStatusCode" />
  <ErrorStatusCode v-if="StatusCode !== false" v-bind:StatusCode="StatusCode"></ErrorStatusCode>
</template>


<script>
import ErrorStatusCode from "../components/ErrorStatusCode.vue";
import ModuleTitles from "../components/ModuleTitles.vue";
import ModuleRandomTitles from "../components/ModuleRandomTitles.vue";
export default {
  components: {
    ErrorStatusCode,
    ModuleTitles,
    ModuleRandomTitles,
  },
  data() {
    return {
      StatusCode: false,
      moduleId: null,
    };
  },
  mounted() {
    this.moduleId = this.$router.currentRoute.value.params.module;
  },

  methods: {
    setStatusCode(code) {
      this.StatusCode = code;
    },
  },
  computed: {
    errored: (vm) => Number.isInteger(vm.StatusCode),
  },
};
</script>
