export default {
  components: true,
  publicRuntimeConfig: {
    MAPS_API_KEY: process.env.MAPS_API_KEY
  },
  privateRuntimeConfig: {},
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
  plugins: ['~/plugins/maps.client']
};