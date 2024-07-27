// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-04-03",
    devtools: { enabled: true },

    ogImage: {
        fonts: ["Montserrat:400", "Montserrat:600"],
    },
    googleFonts: {
        families: {
            Roboto: true,
        },
        download: true,
    },
    site: {
        url: "https://anime.semolik.ru",
    },
    nitro: {
        devProxy: {
            "/api": {
                target: "http://localhost:8000/api",
                changeOrigin: true,
                prependPath: true,
                cookieDomainRewrite: "http://localhost:3000",
            },
        },
    },
    modules: [
        "@pinia/nuxt",
        "nuxt-headlessui",
        "@formkit/nuxt",
        "@nuxtjs/google-fonts",
        "@nuxt/ui",
        "@vueuse/nuxt",
        "nuxt-viewport",
        "nuxt-og-image",
        "@formkit/auto-animate/nuxt",
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
