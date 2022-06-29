export default {
  components: true,
  publicRuntimeConfig: {
    MAPS_API_KEY: process.env.MAPS_API_KEY,
    auth: {
      cookieName: 'idToken',
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    },
    algolia: {
      appId: process.env.ALGOLIA_API_ID,
      key: process.env.ALGOLIA_SEARCH_API_KEY,
    },
    cloudinary: {
      apiKey: process.env.CLOUDINARY_API_KEY,
    },
  },
  privateRuntimeConfig: {
    algolia: {
      appId: process.env.ALGOLIA_API_ID,
      key: process.env.ALGOLIA_UPDATE_API_KEY,
    },
    cloudinary: {
      apiSecret: process.env.CLOUDINARY_API_SECRET,
    },
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
  plugins: ['~/plugins/maps.client', '~/plugins/dataApi', '~/plugins/auth.client'],
  modules: ['~/modules/auth', '~/modules/algolia', '~/modules/cloudinary', '@nuxtjs/cloudinary'],
  devServerHandlers: [],
  buildModules: ['@nuxtjs/tailwindcss', '@nuxt/image'],
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  },
  image: {
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/'+process.env.CLOUDINARY_CLOUD_NAME+'/image/upload/'
    }
  },
  css: ['~/assets/sass/app.scss'],
  build: {
    extractCSS: true,
    loaders: {
      limit: 0,
    }
  },
};