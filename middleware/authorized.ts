export default defineNuxtRouteMiddleware((middleware) => {
    const user = useSupabaseUser();
    if (user.value) {
        return navigateTo("/profile");
    }
});
