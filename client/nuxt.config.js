export default {
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  ssr: true,

  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'server',

  loading: {
    color: '#4C51BF',
    height: '3px'
  },

  server: {
    host: process.env.HOST ?? '0.0.0.0',
    port: process.env.PORT ?? 80
  },

  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: 'Singlelink - A free & open-source Linktree alternative',
    meta: [
      {charset: 'utf-8'},
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'One link for all your content, open-sourced via GPL v3 and built with NuxtJS, MongoDB, and NodeJS.'
      },
      {
        hid: 'og:image',
        name: 'og:image',
        content: 'https://singlelink.co/social-hero.png'
      },
      {
        hid: 'og:title',
        name: 'og:title',
        content: 'Singlelink - A free & open-source Linktree alternative'
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content: 'One link for all your content, open-sourced via GPL v3 and built with NuxtJS, MongoDB, and NodeJS.'
      },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      },
      {
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css'
      }
    ]
  },
  /*
  ** Global CSS
  */
  css: [],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    {
      src: '~plugins/draggable.js',
      ssr: true
    }
  ],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxt/typescript-build',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    'cookie-universal-nuxt',
    '@aceforth/nuxt-optimized-images',
    '@nuxtjs/sitemap',
    'cookie-universal-nuxt'
  ],

  optimizedImages: {
    optimizeImages: true
  },

  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    baseURL: process.env.API_URL ?? 'https://api.singlelink.co' /* REMOVE BEFORE PRODUCTION */
  },

  env: {
    API_URL: process.env.API_URL ?? 'https://api.singlelink.co',
    HOSTNAME: process.env.HOSTNAME ?? 'app.singlelink.co',
    PORT: process.env.PORT ?? 3000,
  },

  sitemap: {
    hostname: 'https://' + process.env.HOSTNAME ?? 'app.singlelink.co'
  },

  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    extend(config, ctx) {
      // const vue = ctx.loaders.vue;

      // Added Line
      config.devtool = ctx.isClient ? 'eval-source-map' : 'inline-source-map';
    }
  },
};
