<template>
    <div class="providers-buttons">
        <div class="provider-button" @click="">
            <Icon name="logos:discord-icon" />
            <span>Discord</span>
        </div>
        <a :href="authorization_url" class="provider-button">
            <Icon name="carbon:logo-github" />
            <span>Github</span>
        </a>
        <div class="provider-button" @click="">
            <Icon name="logos:google-icon" />
            <span>Google</span>
        </div>
    </div>
</template>
<script setup>
import { AuthService } from "@/client";
const { authorization_url } =
    await AuthService.oauthGithubJwtAuthorizeApiV1AuthGithubAuthorizeGet();
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();
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

        svg {
            width: 20px;
            height: 20px;
        }
    }
}
</style>
