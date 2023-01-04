<template>
    <LoginContiner>
        <FormInput
            v-model="login"
            label="Логин"
            placeholder="Введите имя пользователя или e-mail"
        />
        <FormInput
            v-model="password"
            label="Пароль"
            placeholder="Введите пароль"
            type="password"
        />
        <Button @click="handleLogin">Войти</Button>
    </LoginContiner>
</template>
<script setup>
const supabase = useSupabaseClient();
const login = ref("");
const password = ref("");
const loading = ref(false);
const handleLogin = async () => {
    try {
        loading.value = true;
        const { error } = await supabase.auth.signInWithOtp({
            email: login.value,
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
