<template>
    <div class="change-password">
        <form-input
            label="Старый пароль"
            placeholder="Введите старый пароль"
            v-model="oldPassword"
            type="password"
        />
        <form-input-password
            label="Новый пароль"
            placeholder="Введите новый пароль"
            v-model="newPassword"
            type="password"
        />
        <form-input
            label="Повторите новый пароль"
            placeholder="Повторите новый пароль"
            v-model="repeatPassword"
            type="password"
            v-model:wrong="wrongRepeatPassword"
        />

        <u-button
            block
            size="lg"
            class="mt-auto"
            color="amber"
            :disabled="!buttonActive"
            @click="handleChangePassword"
        >
            Сохранить
        </u-button>
    </div>
</template>
<script setup>
import { useAuthStore } from "~~/stores/auth";
import { storeToRefs } from "pinia";
import { AuthService } from "~/client";
const authStore = useAuthStore();
const { $toast } = useNuxtApp();
const { userData } = storeToRefs(authStore);
const oldPassword = ref("");
const newPassword = ref("");
const repeatPassword = ref("");
const wrongRepeatPassword = ref(false);

const buttonActive = computed(() => {
    return (
        oldPassword.value &&
        newPassword.value &&
        repeatPassword.value &&
        newPassword.value === repeatPassword.value
    );
});

const handleChangePassword = async () => {
    if (!buttonActive.value) return;
    try {
        await AuthService.changePasswordApiV1AuthChangePasswordPut({
            password: oldPassword.value,
            new_password: newPassword.value,
        });
        $toast.success("Пароль успешно изменен");
        oldPassword.value = "";
        newPassword.value = "";
        repeatPassword.value = "";
    } catch (e) {
        $toast.error(HandleOpenApiError(e).message);
    }
};
</script>

<style scoped lang="scss">
.change-password {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    height: 100%;
}
</style>
