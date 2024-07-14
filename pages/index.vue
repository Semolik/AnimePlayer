<template>
    <div class="index-page">
        <div class="parser" v-for="parser in parsers">
            <h2>{{ parser.name }}</h2>
            <titles-last
                :parser-id="parser.id"
                :key="parser.id"
                class="main-titles"
            />
        </div>
    </div>
</template>

<script setup>
import { ParsersService } from "~/client";
const parsers = await ParsersService.getParsersApiV1ParsersGet();
</script>

<style lang="scss">
.index-page {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .parser {
        display: flex;
        flex-direction: column;
        gap: 16px;

        h2 {
            font-size: 24px;
            line-height: 32px;
            font-weight: bold;
            color: $primary-text;
        }

        .main-titles {
            grid-template-rows: auto auto;
            grid-auto-rows: 0px;
            position: relative;
            overflow: hidden;
        }
    }
}
</style>
