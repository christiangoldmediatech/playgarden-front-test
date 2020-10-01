export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'universal',
  server: {
    port: process.env.PORT || 8080,
    host: process.env.HOST || '0.0.0.0'
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
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
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
    ]
  },
  /*
   ** Global CSS
   */
  css: [
    './assets/scss/app.scss',
    './assets/scss/pg-icons.scss',
    {
      src: 'tiptap-vuetify/dist/main.css',
      lang: 'css'
    },
    {
      src: 'vue-snotify/styles/material.css',
      lang: 'css'
    }
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
    { src: '@/plugins/tiptapVuetify', mode: 'client' },
    { src: '@/plugins/firebase', mode: 'client' }
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
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/style-resources',
    'vue-scrollto/nuxt',
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
          apiKey: process.env.FIRE_API_KEY || 'AIzaSyC4eRWANSBArXz29BDqIVrnj5uitK7gRkU',
          authDomain: process.env.FIRE_AUTH_DOMAIN || 'playgarden-96da1.firebaseapp.com',
          databaseURL: process.env.FIRE_DATABASE_URL || 'https://playgarden-96da1.firebaseio.com',
          projectId: process.env.FIRE_PROJECT_ID || 'playgarden-96da1',
          storageBucket: process.env.FIRE_STORAGE_BUCKET || 'playgarden-96da1.appspot.com',
          messagingSenderId: process.env.FIRE_MESSAGING_SENDER || '102635929320',
          appId: process.env.FIRE_APP_ID || '1:102635929320:web:830f8d83e04f936368935d'
        },
        services: {
          auth: true
        }
      }
    ]
  ],
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
    apiBaseUrl: process.env.API_BASE_URL || 'https://apidev.playgardenonline.com',
    testEnv: process.env.TEST_ENV || 'LOCAL'
  },
  router: {
    middleware: [
      'auth',
      'fetchUserInfo',
      'recoverRegistrationProcess',
      'emailVerified',
      'redirectProperAuthenticatedSection',
      'redirectIfAuthenticated',
      'onboardingDone',
      'pickChild'
    ]
  }
}
