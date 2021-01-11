// import path from 'path'
// import fs from 'fs'
const googleTagManagerNoScript =
  '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M57SKCV" height="0" width="0" style="display:none;visibility:hidden"></iframe>'

const getTagManagerText = () => {
  if (process.env.TEST_ENV === 'production') {
    return googleTagManagerNoScript
  }
  return ''
}

export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'universal',
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
  serverMiddleware: {
    '/healthcheck': '@/middleware/healthCheck'
  },
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href:
          process.env.TEST_ENV === 'production'
            ? '/app/favicon.ico'
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
          'https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css'
      }
    ],
    script: [
      {
        src:
          process.env.TEST_ENV === 'production'
            ? '/app/js/filesaver.min.js'
            : '/js/filesaver.min.js'
      },
      {
        src:
          process.env.TEST_ENV === 'production'
            ? '/app/js/ics.min.js'
            : '/js/ics.min.js'
      },
      { src: 'https://widget.manychat.com/108368577679635.js', async: true },
      { src: 'https://js.stripe.com/v3/', async: true }
    ],
    noscript: [
      {
        body: true,
        innerHTML: getTagManagerText()
      }
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
    './assets/scss/pg-icons.scss'
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
    { src: '@/plugins/tiptapVuetify', mode: 'client' },
    { src: '@/plugins/firebase', mode: 'client' }
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
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],
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
    '@nuxtjs/gtm',
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
            process.env.FIRE_AUTH_DOMAIN || 'playgarden-96da1.firebaseapp.com',
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
    pageTracking: true // dev test
  },
  sentry: {
    dsn:
      'https://1ab1121d06eb4b3181d83b9da1d69489@o443725.ingest.sentry.io/5417852',
    config: {
      environment: process.env.TEST_ENV || 'LOCAL'
    }
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
    transpile: ['vuetify/lib', 'vee-validate/dist/rules', 'tiptap-vuetify']
  },
  env: {
    apiBaseUrl:
      process.env.API_BASE_URL || 'https://apidev.playgardenonline.com',
    frontendUrl:
      process.env.FRONTEND_URL || 'https://dev.playgardenonline.com/',
    testEnv: process.env.TEST_ENV || 'LOCAL',
    stripePublicKey:
      process.env.STRIPE_PUBLIC ||
      'pk_test_51HKUavFlV2s2JR4RIPnTwt7laAa7Q5T3CXKL5xhGReFmtvcbi2YQDJBz8JnAHw5STCGxNmoWUDlZUnxzCE9imzxF00J5yVNU5Z'
  },
  router: {
    base: process.env.TEST_ENV === 'production' ? '/app/' : '/',
    middleware: [
      'auth',
      'fetchUserInfo',
      'recoverRegistrationProcess',
      'emailVerified',
      'redirectProperAuthenticatedSection',
      'redirectIfAuthenticated',
      'onboardingDone',
      'pickChild'
    ],
    scrollBehavior: () => ({ x: 0, y: 0 })
  }
}
