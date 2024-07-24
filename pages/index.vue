<template>
    <div class="index-page">
        <div class="parser" v-for="parser in parsers">
            <nuxt-link class="parser-name" :to="`/${parser.id}`">
                {{ parser.name }}
                <Icon name="material-symbols:arrow-forward-ios-rounded" />
            </nuxt-link>
            <titles-last :parserId="parser.id" />
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
        gap: 8px;

        @include sm(true) {
            gap: 0;
        }
        .parser-name {
            font-size: 24px;
            line-height: 32px;
            font-weight: 600;
            color: $primary-text;
            display: flex;
            align-items: center;
            gap: 8px;
            @include sm(true) {
                padding: 10px 15px;
                svg {
                    margin-left: auto;
                }
            }
            svg {
                margin-top: 2px;
                width: 18px;
                height: 18px;
                fill: $primary-text;
                transition: transform 0.3s ease;
                color: $secondary-text;
            }

            &:hover {
                @include sm {
                    svg {
                        transform: translateX(4px);
                    }
                }
            }
        }
    }
}
</style>
