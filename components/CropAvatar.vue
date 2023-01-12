<template>
    <div class="crop-avatar">
        <cropper
            :src="modelValue"
            @change="change"
            :stencil-component="CircleStencil"
            @ready="emit('ready')"
        />
    </div>
</template>
<script setup>
import "vue-advanced-cropper/dist/style.css";
import { CircleStencil, Cropper } from "vue-advanced-cropper";
const change = (data) => {
    console.log(data);
};
const { modelValue } = defineProps({
    modelValue: {
        type: String,
        required: true,
    },
});
const emit = defineEmits(["update:modelValue", "ready"]);
</script>
<style lang="scss">
.crop-avatar {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    overflow: hidden;
}
</style>
