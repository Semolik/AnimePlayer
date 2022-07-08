<script setup>
import { RouterView } from "vue-router";
import AppHeader from "./components/AppHeader.vue";
</script>

<template>
  <AppHeader></AppHeader>
  <div class="app-content">
    <RouterView v-slot="{ Component }" :key="$route.fullPath">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
  </div>
</template>

<style lang="scss">
@import "@/assets/base.css";

#app {
  margin: 0 auto;
  font-weight: normal;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 70px 1fr;
}
.app-content {
  grid-row: 2;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
