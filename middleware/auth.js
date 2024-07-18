import { useAuthStore } from "~~/stores/auth";
export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthStore();
    if (import.meta.server) {
        await authStore.getUserData();
    }
    if (!authStore.logined) {
        return navigateTo("/login");
    }
});
