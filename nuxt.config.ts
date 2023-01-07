// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        "nuxt-icon",
        "@nuxtjs/google-fonts",
        "@formkit/nuxt",
        "@nuxtjs/supabase",
        "nuxt-headlessui",
        "@nuxtjs/tailwindcss",
    ],
    headlessui: {
        prefix: "Headless",
    },
    css: [
        "@/assets/styles/global.scss",
        "@egjs/vue3-flicking/dist/flicking.css",
    ],
    googleFonts: {
        families: {
            "Open+Sans": true,
        },
        // download: true,
        // inject: true,
    },
    plugins: [{ src: "~/plugins/vue-toastification.js", mode: "client" }],
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: [
                        '@use "@/assets/styles/_colors.scss" as *;',
                        '@use "@/assets/styles/helpers.scss" as *;',
                        '@use "@/assets/styles/breakpoints.scss" as *;',
                    ].join(""),
                },
            },
        },
    },
});
