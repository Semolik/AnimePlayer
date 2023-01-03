// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        "nuxt-icon",
        "@nuxtjs/google-fonts",
        "@formkit/nuxt",
        "@nuxtjs/supabase",
    ],
    css: [
        "@/assets/style/global.scss",
        "@egjs/vue3-flicking/dist/flicking.css",
    ],
    googleFonts: {
        families: {
            "Open+Sans": true,
        },
        // download: true,
        // inject: true,
    },
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: [
                        '@use "@/assets/style/_colors.scss" as *;',
                        '@use "@/assets/style/helpers.scss" as *;',
                        '@use "@/assets/style/breakpoints.scss" as *;',
                    ].join(""),
                },
            },
        },
    },
});
