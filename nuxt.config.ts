// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-04-03",
    devtools: { enabled: true },
    ui: {
        primary: "amber",
        gray: "slate",
    },
    fonts: {
        families: [{ name: "Open Sans", provider: "google" }],
    },
    routeRules: {
        "/api/**": { proxy: { to: "http://127.0.0.1:8000/api/**" } },
    },
    icon: {
        componentName: "NuxtIcon",
    },
    modules: [
        "@pinia/nuxt",
        "nuxt-headlessui",
        "@formkit/nuxt",
        "@nuxt/fonts",
        "@nuxt/ui",
        "@vueuse/nuxt",
    ],
    css: ["@/assets/styles/global.scss"],
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

    formkit: {
        autoImport: true,
    },
});
