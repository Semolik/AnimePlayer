<template>
    <div
        class="player-container"
        :style="{ display: isOpen ? 'block' : 'none' }"
    >
        <video controls playsinline id="plyr-player"></video>
    </div>
</template>
<script setup>
import "plyr/dist/plyr.css";
import { usePlayerStore } from "~/stores/player";
const { isOpen } = storeToRefs(usePlayerStore());
</script>
