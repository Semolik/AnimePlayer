<template>
    <canvas ref="canvas" :width="currentWidth" :height="currentHeight" />
</template>

<script>
import { decodeBlurHash } from "fast-blurhash";
export default {
    props: {
        hash: {
            type: String,
            required: true,
        },
        width: {
            type: Number,
            default: 128,
        },
        height: {
            type: Number,
            default: 128,
        },
        punch: {
            type: Number,
            default: 1,
        },
    },
    data() {
        return {
            currentWidth: this.width,
            currentHeight: this.height,
            currentPunch: this.punch,
        };
    },
    watch: {
        width(value) {
            this.currentWidth = value;
            this.draw();
        },
        height(value) {
            this.currentHeight = value;
            this.draw();
        },
        punch(value) {
            this.currentPunch = value;
            this.draw();
        },
        hash(value) {
            this.draw();
        },
    },
    mounted() {
        this.draw();
    },
    methods: {
        draw() {
            const pixels = decodeBlurHash(
                this.hash,
                this.width,
                this.height,
                this.punch
            );
            const ctx = this.$refs.canvas.getContext("2d");
            const imageData = ctx.createImageData(this.width, this.height);
            imageData.data.set(pixels);
            ctx.putImageData(imageData, 0, 0);
        },
    },
};
</script>
