const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

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
    host: process.env.SERVER_HOST ?? '0.0.0.0',
    port: process.env.PORT ?? 80
  },

  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: process.env.META_TITLE ?? 'Singlelink - The open-source Linktree alternative & micro-site platform',
    meta: [
      {charset: 'utf-8'},
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, user-scalable=no'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.META_DESCRIPTION ?? "Singlelink is the open-source Linktree alternative without limits. Supercharge your micro-site in sixty seconds today!"
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: process.env.META_DESCRIPTION ?? "Singlelink is the open-source Linktree alternative without limits. Supercharge your micro-site in sixty seconds today!"
      },
      {
        hid: 'og:image',
        name: 'og:image',
        content: process.env.META_IMAGE ?? 'https://singlelink-22fp7.ondigitalocean.app/open-graph-image-v2.png'
      },
      {
        hid: 'twitter:image',
        name: 'twitter:image',
        content: process.env.META_IMAGE ?? 'https://singlelink-22fp7.ondigitalocean.app/open-graph-image-v2.png'
      },
      {
        hid: 'og:title',
        name: 'og:title',
        content: process.env.META_TITLE ?? "Singlelink is the open-source Linktree alternative without limits. Supercharge your micro-site in sixty seconds today!"
      },
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: process.env.META_TITLE ?? "Singlelink is the open-source Linktree alternative without limits. Supercharge your micro-site in sixty seconds today!"
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content: process.env.META_DESCRIPTION ?? "Singlelink is the open-source Linktree alternative without limits. Supercharge your micro-site in sixty seconds today!"
      },
      {
        hid: 'twitter:url',
        name: 'twitter:url',
        content: ('https://' + process.env.HOSTNAME) ?? 'https://app.singlelink.co'
      },
      {
        hid: 'twitter:card',
        name: 'twitter:card',
        content: 'summary_large_image'
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: process.env.FAVICON ?? '/sl-icon.svg'
      },
      {
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css'
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap'
      }
    ],
    script: [
      {
        hid: 'slpa',
        src: 'https://singlelink.co/slpa.js',
        defer: true,
        'data-domain': 'singlelink.co',
        async: true
      },
      {
        hid: 'simplefileupload',
        src: 'https://app.simplefileupload.com/buckets/299048f4bf460802e90ea160f0c46064.js',
        defer: true
      }
    ]
  },
  /*
  ** Global CSS
  */
  css: [
    '~/assets/css/theme.css'
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    {
      src: '~plugins/draggable.js',
      ssr: true
    },
    {
      src: '~plugins/cssjson.js',
      srr: true,
    },
    {
      src: '~plugins/monaco.js',
      ssr: false
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
    '@nuxtjs/tailwindcss',
    '@nuxtjs/dotenv'
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
    APP_NAME: process.env.APP_NAME ?? 'Singlelink',
    LOGO_URL: process.env.LOGO_URL ?? '/logo.svg',
    LOGO_WIDTH: process.env.LOGO_WIDTH ?? '200px',
    ICON_URL: process.env.ICON_URL ?? '/icon.svg',
    ICON_WIDTH: process.env.ICON_WIDTH ?? '46px',
    ORGANIZATION: process.env.ORGANIZATION ?? 'Neutron Creative Inc.',
    FREE_SIGNUP: process.env.FREE_SIGNUP || true,
    QR_API: process.env.QR_API || null,
  },

  sitemap: {
    hostname: 'https://' + process.env.HOSTNAME ?? 'app.singlelink.co'
  },
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    plugins: [
      new MonacoWebpackPlugin({
        features: [
          '!goToDefinitionCommands',
          '!goToDefinitionMouse',
          '!referenceSearch'
        ],
        languages: ['css', 'html'],
      })
    ],
    extend(config, ctx) {
      // const vue = ctx.loaders.vue;

      // Added Line
      config.devtool = ctx.isClient ? 'eval-source-map' : 'inline-source-map';
    }
  },
};
