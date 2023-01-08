<template>
    <AsidePage>
        <template #aside>
            <AsidePageItem to="/profile">
                <Icon name="material-symbols:person" />
                <span>Информация</span>
            </AsidePageItem>
            <AsidePageItem to="/profile/integrations">
                <Icon name="carbon:ibm-cloud-direct-link-1-connect" />
                <span>Интеграции</span>
            </AsidePageItem>
            <AsidePageItem @click="handleLogout">
                <Icon name="material-symbols:logout" />
                <span>Выйти</span>
            </AsidePageItem>
        </template>
        <template #content>
            <NuxtPage></NuxtPage>
        </template>
    </AsidePage>
</template>
<style lang="scss" scoped>
.logout {
    display: flex;
    gap: 10px;
    .button {
        background-color: rgba($color: white, $alpha: 0.1);
    }
}
</style>
<script setup>
definePageMeta({
    middleware: ["auth"],
});
const supabase = useSupabaseAuthClient();
const router = useRouter();
const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error.message);
    router.push("/");
};
</script>
