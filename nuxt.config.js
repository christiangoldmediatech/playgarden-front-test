// import path from 'path'
// import fs from 'fs'
import { Integrations } from '@sentry/tracing'

const baseRouteProd = '/school/'

export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/docs/configuration-glossary/configuration-target#the-target-property
   */
  ssr: false,

  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',

  paralell: true,
  cache: true,
  server: {
    port: process.env.PORT || 8080,
    host: process.env.HOST || '0.0.0.0'
    //   host: process.env.HOST || '0.0.0.0',
    //   https: !['production', 'staging'].includes(process.env.NODE_ENV) ? {
    //   key: fs.readFileSync(path.resolve(__dirname, 'keys/server.key')),
    //   cert: fs.readFileSync(path.resolve(__dirname, 'keys/server.crt'))
    //  } : undefined
  },
  serverMiddleware: [
    '~/middleware/serverAuthByCookie',
    { path: '/healthcheck', handler: '~/middleware/healthCheck.js' }
  ],
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: 'Playgarden Prep Online',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    bodyAttrs: {
      style: 'overflow: visible !important;'
    },
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href:
          process.env.TEST_ENV === 'production'
            ? `${baseRouteProd}favicon.ico`
            : '/favicon.ico'
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href:
          'https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;400;500;700;900&display=swap'
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href:
          'https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;700&display=swap'
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href:
          'https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css'
      }
    ],
    script: [
      {
        src:
          process.env.TEST_ENV === 'production'
            ? `${baseRouteProd}js/filesaver.min.js`
            : '/js/filesaver.min.js'
      },
      {
        src:
          process.env.TEST_ENV === 'production'
            ? `${baseRouteProd}js/ics.min.js`
            : '/js/ics.min.js'
      },
      { src: 'https://js.stripe.com/v3/', async: true }
    ],
    __dangerouslyDisableSanitizers: ['noscript']
  },
  /*
   ** Global CSS
   */
  css: [
    {
      src: 'tiptap-vuetify/dist/main.css',
      lang: 'css'
    },
    {
      src: 'vue-snotify/styles/material.css',
      lang: 'css'
    },
    './assets/scss/pg-components/index.scss',
    './assets/scss/app.scss',
    './assets/scss/pg-icons.scss',
    './assets/css/main.css'
  ],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    '@/plugins/axios',
    '@/plugins/components',
    '@/plugins/directives',
    '@/plugins/filters',
    '@/plugins/globalPartials',
    '@/plugins/snotify',
    '@/plugins/validate',
    '@/plugins/vueCtkDateTimePicker',
    { src: '@/plugins/echarts', mode: 'client' },
    { src: '@/plugins/tiptapVuetify', mode: 'client' },
    { src: '@/plugins/firebase', mode: 'client' },
    {
      src: '~/plugins/sentry'
    },
    {
      src: '~/plugins/cookies'
    },
    {
      src: '~/plugins/events/eventBus'
    }
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: false,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    'nuxt-typed-vuex',
    '@nuxt/postcss8',
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxt/typescript-build',
    '@nuxtjs/gtm',
    '@nuxtjs/vuetify',
    '@nuxtjs/composition-api'
  ],
  /**
   * Vue Options
   */
  vue: {
    config: {
      productionTip: true,
      devtools: process.env.TEST_ENV !== 'production'
    }
  },
  /**
   * Vuetify Options
   */
  vuetify: {
    customVariables: [
      './assets/scss/vuetify/variables.scss',
      './assets/scss/vuetify/overrides.scss'
    ],
    defaultAssets: false,
    optionsPath: './vuetify.options.js',
    treeShake: true
  },
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/sentry',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/style-resources',
    'vue-scrollto/nuxt',
    'vue-social-sharing/nuxt',
    [
      'storyblok-nuxt',
      {
        accessToken: 'LJnuWOtv8zRkJrzhU2osxAtt',
        cacheProvider: 'memory'
      }
    ],
    [
      '@nuxtjs/firebase',
      {
        config: {
          apiKey:
            process.env.FIRE_API_KEY ||
            'AIzaSyC4eRWANSBArXz29BDqIVrnj5uitK7gRkU',
          authDomain:
            process.env.FIRE_AUTH_DOMAIN || 'sso.playgardenonline.com',
          databaseURL:
            process.env.FIRE_DATABASE_URL ||
            'https://playgarden-96da1.firebaseio.com',
          projectId: process.env.FIRE_PROJECT_ID || 'playgarden-96da1',
          storageBucket:
            process.env.FIRE_STORAGE_BUCKET || 'playgarden-96da1.appspot.com',
          messagingSenderId:
            process.env.FIRE_MESSAGING_SENDER || '102635929320',
          appId:
            process.env.FIRE_APP_ID ||
            '1:102635929320:web:830f8d83e04f936368935d'
        },
        services: {
          auth: true
        }
      }
    ]
  ],
  // https://www.npmjs.com/package/@nuxtjs/google-tag-manager
  gtm: {
    id: process.env.GTM_ID,
    pageTracking: true, // dev test,
    enabled: true,
    debug: process.env.TEST_ENV !== 'production'
  },
  publicRuntimeConfig: {
    gtm: {
      id: process.env.GTM_ID
    }
  },
  sentry: {
    dsn:
      'https://1ab1121d06eb4b3181d83b9da1d69489@o443725.ingest.sentry.io/5417852',
    config: {
      environment: process.env.TEST_ENV || 'LOCAL',
      release: process.env.SENTRY_RELEASE
    },
    publishRelease: true,
    sourceMapStyle: 'hidden-source-map',
    tracing: true,
    integrations: [new Integrations.BrowserTracing()]
  },
  styleResources: {
    scss: [
      './assets/scss/mixins/_mixins.scss',
      './assets/scss/mixins/_text.scss',
      './assets/scss/mixins/_image.scss'
    ]
  },
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
    transpile: [
      'vuetify/lib',
      'vee-validate/dist/rules',
      'tiptap-vuetify',
      'vue-echarts',
      'resize-detector',
      '@gold-media-tech/pg-video-player'
    ],
    build: {
      extend (config, ctx) {
        if (ctx.isDev) {
          config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map'
        }
      }
    },
    babel: {
      plugins: [['@babel/plugin-proposal-private-methods', { loose: true }]]
    },
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {}
      }
    }
  },
  env: {
    apiBaseUrl:
      process.env.API_BASE_URL || 'https://apidev.playgardenonline.com',
    frontendUrl:
      process.env.FRONTEND_URL || 'https://dev.playgardenonline.com/',
    testEnv: process.env.TEST_ENV || 'LOCAL',
    stripePublicKey:
      process.env.STRIPE_PUBLIC ||
      'pk_test_51HKUavFlV2s2JR4RIPnTwt7laAa7Q5T3CXKL5xhGReFmtvcbi2YQDJBz8JnAHw5STCGxNmoWUDlZUnxzCE9imzxF00J5yVNU5Z',
    gtm: process.env.GTM_ID,
    dropBoxApiKey: process.env.DROPBOX_API_KEY || '',
    baseRouteProd,
    googlePlacesAPI: process.env.GOOGLE_PLACES_API_KEY || 'AIzaSyDh0lrueon0BEux1pIuT40ivuEI92qJr3o',
    kidsCornerUrl: process.env.KIDS_CORNER_URL || 'http://localhost:8081',
    playgardenAdminUrl: process.env.PLAYGARDEN_ADMIN_URL || 'http://localhost:8081'
  },
  router: {
    base: process.env.TEST_ENV === 'production' ? baseRouteProd : '/',
    middleware: [
      // 'checkJWT',
      // 'auth',
      'routeHandler',
      'recoverRegistrationProcess'
      // 'pickChild'
      // 'fetchUserInfo',
      // 'emailVerified'
      // 'redirectProperAuthenticatedSection',
      // 'redirectIfAuthenticated',
      // 'redirectIfSubscriptionCancelled',
    ],
    scrollBehavior: () => ({ x: 0, y: 0 })
  }
}
