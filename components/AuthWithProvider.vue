<template>
    <div class="providers-buttons">
        <div class="provider-button" @click="handleGoogleLogin">
            <Icon name="logos:google-icon" />
            <span>Google</span>
        </div>
        <div class="provider-button" @click="handleGithubLogin">
            <Icon name="logos:github-icon" />
            <span>Github</span>
        </div>
    </div>
</template>
<script setup>
const supabase = useSupabaseClient();
const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
    });
    if (error) alert(error.message);
};
const handleGithubLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
    });
    if (error) alert(error.message);
};
</script>
<style lang="scss">
.providers-buttons {
    display: flex;
    gap: 10px;
    .provider-button {
        @include flex-center;
        width: 100%;
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
