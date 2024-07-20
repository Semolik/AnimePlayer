import { useAuthStore } from "@/stores/auth";

export default defineNuxtPlugin({
    hooks: {
        async "app:created"() {
            const authStore = useAuthStore();
            if (!authStore.logined) {
                await authStore.getUserData();
            }
        },
    },
});
