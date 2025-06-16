export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "nuxt-auth-utils"],

  app: {
    head: {
      htmlAttrs: { lang: "fr" },
      link: [{ rel: "icon", href: "/favicon.svg" }],
    },
  },

  experimental: {
    inlineRouteRules: true,
  },
})
