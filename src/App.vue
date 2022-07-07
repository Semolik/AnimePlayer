<script setup>
import { RouterView } from "vue-router";
import AppHeader from "./components/AppHeader.vue";
// import HelloWorld from "@/components/HelloWorld.vue";
</script>

<template>
  <AppHeader></AppHeader>
  <RouterView v-slot="{ Component }" :key="$route.fullPath">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </RouterView>
</template>

<style lang="scss">
@import "@/assets/base.css";

#app {
  margin: 0 auto;
  font-weight: normal;
}
</style>
