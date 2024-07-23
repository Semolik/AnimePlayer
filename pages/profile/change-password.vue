<template>
    <div class="change-password">
        <form-input-password
            label="Новый пароль"
            placeholder="Введите новый пароль"
            v-model="newPassword"
            type="password"
            v-model:wrong="weekPassword"
        />
        <form-input
            label="Повторите новый пароль"
            placeholder="Повторите новый пароль"
            v-model="repeatPassword"
            type="password"
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
import { AuthService } from "~/client";
const { $toast } = useNuxtApp();
const newPassword = ref("");
const weekPassword = ref(false);
const repeatPassword = ref("");

const buttonActive = computed(() => {
    return (
        newPassword.value &&
        repeatPassword.value &&
        newPassword.value === repeatPassword.value &&
        !weekPassword.value
    );
});

const handleChangePassword = async () => {
    if (!buttonActive.value) return;
    try {
        await AuthService.changePasswordApiV1AuthChangePasswordPut({
            new_password: newPassword.value,
        });
        $toast.success("Пароль успешно изменен");
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
