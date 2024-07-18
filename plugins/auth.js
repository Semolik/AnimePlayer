import { useAuthStore } from "@/stores/auth";

export default defineNuxtPlugin({
    hooks: {
        async "app:created"() {
            const authStore = useAuthStore();
            console.log(authStore.userData, authStore.logined);
            if (!authStore.logined) {
                await authStore.getUserData();
            }
        },
    },
});
