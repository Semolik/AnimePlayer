import { useAuthStore } from "@/stores/auth";
import { useAppDataStore } from "@/stores/data";
export default defineNuxtPlugin({
    hooks: {
        async "app:created"() {
            const authStore = useAuthStore();
            const appDataStore = useAppDataStore();
            if (!authStore.logined) {
                await authStore.getUserData();
            }
            await appDataStore.fetchData();
        },
    },
});
