<template>
    <div
        class="player-container"
        :style="{ display: isOpen ? 'block' : 'none' }"
    >
        <video controls playsinline ref="videoElement"></video>
    </div>
</template>
<script setup>
import "plyr/dist/plyr.css";
import { usePlayerStore } from "~/stores/player";
const playerStore = usePlayerStore();
const { isOpen, video } = storeToRefs(playerStore);

const videoElement = ref(null);
onMounted(() => {
    nextTick(() => {
        video.value = videoElement.value;
    });
});
</script>
