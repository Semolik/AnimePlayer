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
const router = useRouter();

definePageMeta({
    title: "Вход",
    description: "Вход в систему",
});

const email = ref("");
const password = ref("");
const handleLogin = async () => {
    try {
        if (error) throw error;
        router.push("/");
    } catch (error) {
        toast.error(error.error_description || error.message);
    }
};
</script>
