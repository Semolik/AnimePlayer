// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ["nuxt-icon"],
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: [
                        '@use "@/assets/style/_colors.scss" as *;',
                        '@use "@/assets/style/helpers.scss" as *;',
                        '@use "@/assets/style/breakpoints.scss" as *;',
                        '@import "@/assets/style/global.scss";',
                    ].join(""),
                },
            },
        },
    },
});
