
export default {
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  mode: 'spa',
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'static',
  /*
  ** Hosting 404 Hotfix
  ** See https://ko.nuxtjs.org/faq/netlify-deployment/
  */
  generate: {
    fallback: true
  },
  loading: {
    color: '#4C51BF',
    height: '3px'
  },
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: 'Singlelink - A free & open-source Linktree alternative',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'One link for all your content, open-sourced via GPL v3 and built with NuxtJS, MongoDB, and NodeJS.' },
      { name: 'og:image', content: 'https://singlelink.co/social-hero.png' },
      { name: 'og:title', content: 'Singlelink - A free & open-source Linktree alternative' },
      { name: 'og:description', content: 'One link for all your content, open-sourced via GPL v3 and built with NuxtJS, MongoDB, and NodeJS.' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    { src: '~plugins/draggable.js', ssr: false }
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
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    baseURL: process.env.BASE_URL || 'https://api.singlelink.co' /* REMOVE BEFORE PRODUCTION */
  },
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    extend(config, ctx) {
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({
          enforce : 'pre',
          test    : /\.(js|vue)$/,
          loader  : 'eslint-loader',
          exclude : /(node_modules)/,
          options : {
            fix : true
          }
        });
      }
    }
  }
}
