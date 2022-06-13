export default {
  components: true,
  publicRuntimeConfig: {
    MAPS_API_KEY: process.env.MAPS_API_KEY,
    ALGOLIA_SEARCH_API_KEY: process.env.ALGOLIA_SEARCH_API_KEY,
  },
  privateRuntimeConfig: {
    ALGOLIA_ADMIN_API_KEY: process.env.ALGOLIA_ADMIN_API_KEY,
  },
  head: {
    titleTemplate: "Mastering Nuxt: %s",
    htmlAttrs: {
      lang: "en",
    },
    bodyAttrs: {
      class: ["my-style"],
    },
    meta: [
      { charset: "utf-8" },
    ],
  },
  router: {
    prefetchLinks: false,
  },
  plugins: ['~/plugins/maps.client', '~/plugins/dataApi'],
  modules: [],
  devServerHandlers: [],
  buildModules: ['@nuxtjs/tailwindcss']
};