<template>
    <div class="providers-buttons">
        <div class="provider-button" @click="useLoginWithProvider('discord')">
            <Icon name="logos:discord-icon" />
            <span>Discord</span>
        </div>
        <div class="provider-button" @click="useLoginWithProvider('github')">
            <Icon name="logos:github-icon" />
            <span>Github</span>
        </div>
        <div class="provider-button" @click="useLoginWithProvider('google')">
            <Icon name="logos:google-icon" />
            <span>Google</span>
        </div>
    </div>
</template>
<script setup>
import { useLoginWithProvider } from "@/composables/loginWithProvider";
</script>
<style lang="scss">
.providers-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    .provider-button {
        @include flex-center;
        flex-grow: 1;
        cursor: pointer;
        padding: 10px 20px;
        border-radius: 5px;
        color: $secondary-text;
        background-color: $tertiary-bg;
        &:hover {
            background-color: $quaternary-bg;
            color: $primary-text;
        }
        span {
            margin-left: 10px;
        }
    }
}
</style>
