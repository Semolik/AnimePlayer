<template>
  <ModuleRandomTitles v-if="moduleId && !errored" @error="setStatusCode" />
  <ModuleTitles v-if="moduleId && !errored" @error="setStatusCode" />
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
      moduleId: this.$router.currentRoute.value.params.module,
    };
  },
  provide() {
    // use function syntax so that we can access `this`
    return {
      moduleId: this.moduleId,
    }
  },
  methods: {
    setStatusCode(code) {
      console.log(code);
      this.StatusCode = code.request.status;
    },
  },
  computed: {
    errored: (vm) => Number.isInteger(vm.StatusCode),
  },
};
</script>
