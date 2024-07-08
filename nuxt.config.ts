// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-04-03",
    devtools: { enabled: true },
    modules: [
        "@nuxtjs/tailwindcss",
        "nuxt-headlessui",
        "@formkit/nuxt",
        "@nuxt/fonts",
        "@nuxt/icon",
    ],
    css: [
        "@/assets/styles/global.scss",
        "@egjs/vue3-flicking/dist/flicking.css",
    ],
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
    icon: {
        size: "24px",
        class: "icon",
        mode: "svg",
    },
    formkit: {
        autoImport: true,
    },
});
