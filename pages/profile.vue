<template>
    <selection-page :links="asideLinks" indexPath="/profile">
        <template #aside>
            <selection-link
                icon="material-symbols:logout"
                @click="logout"
                class="logout"
            >
                Выйти из аккаунта
            </selection-link>
        </template>
        <NuxtPage />
    </selection-page>
</template>
<script setup>
import { useAuthStore } from "~~/stores/auth";
const authStore = useAuthStore();
const router = useRouter();
const logout = async () => {
    await authStore.logout();
    router.push("/login");
};
definePageMeta({
    middleware: ["auth"],
});
const asideLinks = [
    {
        title: "Информация",
        icon: "material-symbols:person",
        to: "/profile/edit",
    },
    {
        title: "Сменить пароль",
        icon: "carbon:locked",
        to: "/profile/change-password",
    },
    {
        title: "Интеграции",
        icon: "carbon:ibm-cloud-direct-link-1-connect",
        to: "/profile/integrations",
    },
];
</script>
<style scoped lang="scss">
.logout {
    @include md {
        margin-top: auto;
    }
}
</style>
