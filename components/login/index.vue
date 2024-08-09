<template>
    <FormInput v-model="email" label="Почта" placeholder="Введите e-mail" />
    <FormInput
        v-model="password"
        label="Пароль"
        placeholder="Введите пароль"
        type="password"
    />
    <Button @click="handleLogin" :active="formIsValid" highlight-active>
        Войти
    </Button>
</template>
<script setup>
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();
const { $toast } = useNuxtApp();
definePageMeta({
    title: "Вход",
    description: "Вход в систему",
});
const submited = ref(false);
const email = ref("");
const password = ref("");
const formIsValid = computed(() => !!email.value && !!password.value);
const emit = defineEmits(["login"]);
const handleLogin = async () => {
    if (submited.value) return;
    submited.value = true;
    const error = await authStore.login(email.value, password.value);
    if (error) {
        $toast.error(HandleOpenApiError(error).message);
    } else {
        emit("login");
    }
    submited.value = false;
};
</script>
