<template>
    <AsidePageHeadline
        title="Интеграции"
        subtitle="Подключите свои аккаунты для удобства"
    />
    <div class="integrations-container">
        <div
            class="integration"
            @[!discordConnected&&`click`]="useLoginWithProvider('discord')"
        >
            <Icon name="logos:discord-icon" />
            <span>Discord</span>
            <LabelEnabled v-if="discordConnected" />
            <LabelConnect v-else />
        </div>
        <div
            class="integration"
            @[!githubConnected&&`click`]="useLoginWithProvider('github')"
        >
            <Icon name="logos:github-icon" />
            <span>Github</span>
            <LabelEnabled v-if="githubConnected" />
            <LabelConnect v-else />
        </div>
        <div
            class="integration"
            @[!googleConnected&&`click`]="useLoginWithProvider('google')"
        >
            <Icon name="logos:google-icon" />
            <span>Google</span>
            <LabelEnabled v-if="googleConnected" />
            <LabelConnect v-else />
        </div>
    </div>
</template>
<script setup>
const user = useSupabaseUser();
const findIdentity = (user, provider) => {
    return user.value?.identities?.find((i) => i.provider === provider);
};
const discordConnected = computed(() => {
    return !!findIdentity(user, "discord");
});
const githubConnected = computed(() => {
    return !!findIdentity(user, "github");
});
const googleConnected = computed(() => {
    return !!findIdentity(user, "google");
});
</script>
<style lang="scss" scoped>
.integrations-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    .integration {
        border-radius: 8px;
        background-color: $tertiary-bg;
        padding: 20px;
        flex-grow: 1;
        display: flex;
        gap: 20px;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        &:hover {
            background-color: $quaternary-bg;
        }
        svg {
            width: 30px;
            height: 30px;
        }
        span {
            text-align: center;
            font-size: 1.1rem;
            color: $secondary-text;
        }
    }
}
</style>
