<template>
    <div class="logout">
        <div @click="handleLogout" class="button">
            <Icon name="material-symbols:logout" />
            <span>Logout</span>
        </div>
        <nuxt-link to="/login" class="button">Login</nuxt-link>
    </div>
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
const supabase = useSupabaseAuthClient();
const router = useRouter();

const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error.message);
    router.push("/");
};
</script>
