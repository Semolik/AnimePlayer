// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ["nuxt-icon"],
    css: [
        "@/assets/style/global.scss",
        "@egjs/vue3-flicking/dist/flicking.css",
    ],
    // plugins: [{ src: "@/plugins/blurhash", mode: "client" }],
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
