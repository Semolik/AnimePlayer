<template>
    <LoginContiner>
        <FormInput v-model="email" label="Почта" placeholder="Введите e-mail" />
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
import { useToast } from "vue-toastification";
const toast = useToast();

definePageMeta({
    title: "Вход",
    description: "Вход в систему",
    middleware: ["authorized"],
});
const supabase = useSupabaseClient();
const email = ref("");
const password = ref("");
const loading = ref(false);
const handleLogin = async () => {
    try {
        loading.value = true;
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value,
        });
        if (error) throw error;
    } catch (error) {
        toast.error(error.error_description || error.message);
    } finally {
        loading.value = false;
    }
};
</script>
