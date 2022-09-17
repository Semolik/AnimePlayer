<script setup>
import { RouterView } from "vue-router";
import AppHeader from "./components/AppHeader.vue";
import "@fontsource/open-sans";
import AppSettings from "./components/AppSettings.vue";
</script>

<template>
  <AppHeader />
  <AppSettings />
  <div class="app-content">
    <RouterView v-slot="{ Component }" :key="$route.fullPath">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
  </div>
</template>

<style lang="scss">
@import "@/assets/styles/base.css";
@import "@/assets/styles/breakpoints";
@import "@/assets/styles/MoveTransitions.css";

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

  @include sm {
    padding-top: 10px;
  }
}
</style>
