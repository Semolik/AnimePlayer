<template>
    <LoginContiner :welcome="true">
        <FormInput v-model="email" label="Почта" placeholder="Введите e-mail" />
        <Button @clicked="handleLogin"> Зарегистрироваться </Button>
    </LoginContiner>
</template>
<script setup>
definePageMeta({
    title: "Вход",
    description: "Вход в систему",
    middleware: ["authorized"],
});
const supabase = useSupabaseClient();
const email = ref("");
const loading = ref(false);
const handleLogin = async () => {
    try {
        loading.value = true;
        const { error } = await supabase.auth.signInWithOtp({
            email: email.value,
        });
        if (error) throw error;
        alert("Check your email for the login link!");
    } catch (error) {
        alert(error.error_description || error.message);
    } finally {
        loading.value = false;
    }
};
</script>
