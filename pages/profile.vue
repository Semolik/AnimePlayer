<template>
    <selection-page>
        <template #aside>
            <selection-link to="/profile" icon="material-symbols:person">
                Информация
            </selection-link>
            <selection-link
                to="/profile/integrations"
                icon="carbon:ibm-cloud-direct-link-1-connect"
            >
                Интеграции
            </selection-link>
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
</script>
<style scoped lang="scss">
.logout {
    @include md {
        margin-top: auto;
    }
    @include md(true) {
        margin-left: auto;
    }
}
</style>
