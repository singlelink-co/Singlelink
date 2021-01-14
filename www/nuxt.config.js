
export default {
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  mode: 'universal',
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'static',
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: 'Singlelink - A single link for everything 🔗🔥',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Your beautiful & SEO optimized profile with a Singlelink for your social media bio. Create your free profile in seconds!' },
      { name: 'og:image', content: 'https://singlelink.co/open-graph-image.png' },
      { name: 'og:title', content: 'Singlelink - There\'s a single link for everything 🔗🔥' },
      { name: 'og:description', content: 'Your beautiful & SEO optimized profile with a Singlelink for your social media bio. Create your free profile in seconds!'},
      { name: 'twitter:image', content: 'https://singlelink.co/open-graph-image.png' },
      { name: 'twitter:title', content: 'Singlelink - There\'s a single link for everything 🔗🔥' },
      { name: 'twitter:description', content: 'Your beautiful & SEO optimized profile with a Singlelink for your social media bio. Create your free profile in seconds!'},
      { name: 'twitter:card', content: 'summary_large_image'},
      { hid: 'robots', name: 'robots', content: 'https://singlelink.co/robots.txt' }
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
  plugins: [{ src: "@/plugins/aos", ssr: false }],
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
  axios: {},
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
  }
}
