// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ["@nuxtjs/color-mode"],
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData:
                        '@use "@/assets/style/_colors.scss" as *;@import "@/assets/style/global.scss";',
                },
            },
        },
    },
});
