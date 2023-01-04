<template>
    <div class="providers-buttons">
        <div class="provider-button" @click="handlebLogin('discord')">
            <Icon name="logos:discord-icon" />
            <span>Discord</span>
        </div>
        <div class="provider-button" @click="handlebLogin('github')">
            <Icon name="logos:github-icon" />
            <span>Github</span>
        </div>
        <div class="provider-button" @click="handlebLogin('google')">
            <Icon name="logos:google-icon" />
            <span>Google</span>
        </div>
    </div>
</template>
<script setup>
const supabase = useSupabaseClient();

const handlebLogin = async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
    });
    if (error) alert(error.message);
};
</script>
<style lang="scss">
.providers-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    .provider-button {
        @include flex-center;
        // width: 100%;
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
