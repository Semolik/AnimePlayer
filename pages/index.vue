<template>
    <div class="index-page">
        <div class="parser" v-for="parser in parsers">
            <div class="parser-name">{{ parser.name }}</div>
            <titles-last
                :parser-id="parser.id"
                :key="parser.id"
                class="main-titles"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
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

        .parser-name {
            font-size: 24px;
            line-height: 32px;
            font-weight: 600;
            color: $primary-text;
        }

        .main-titles {
            padding-top: 8px;
            grid-template-rows: auto auto;
            grid-auto-rows: 0px;
            position: relative;
            overflow: hidden;
        }
    }
}
</style>
