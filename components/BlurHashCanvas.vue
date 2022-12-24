<template>
    <canvas ref="canvas" :width="currentWidth" :height="currentHeight" />
</template>

<script>
import { decode } from "blurhash";
import { parseNumber } from "./utils";

export default {
    props: {
        hash: {
            type: String,
            required: true,
        },
        width: {
            type: [Number, String],
            default: 128,
        },
        height: {
            type: [Number, String],
            default: 128,
        },
        punch: {
            type: Number,
            default: 1,
        },
    },
    data() {
        return {
            currentWidth: parseNumber(this.width),
            currentHeight: parseNumber(this.height),
            currentPunch: parseNumber(this.punch),
        };
    },
    mounted() {
        this.draw();
    },
    methods: {
        draw() {
            const pixels = decode(
                this.hash,
                this.currentWidth,
                this.currentHeight,
                this.punch
            );
            const ctx = this.$refs.canvas.getContext("2d");
            const imageData = ctx.createImageData(
                this.currentWidth,
                this.currentHeight
            );
            imageData.data.set(pixels);
            ctx.putImageData(imageData, 0, 0);
        },
    },
};
</script>
