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
    ],
    script: [
      {
        src: 'https://cdn.jwplayer.com/libraries/Emctu8OT.js'
      }
    ]
  },
  /*
   ** Global CSS
   */
  css: [
    'tiptap-vuetify/dist/main.css',
    'vue-snotify/styles/material.css'
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
    { src: '@/plugins/tiptapVuetify', mode: 'client' }
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
    optionsPath: './vuetify.options.js',
    defaultAssets: false
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
    ]
  ],
  styleResources: {
    scss: [
      './assets/scss/variables.scss',
      './assets/scss/app.scss'
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
      process.env.API_BASE_URL ||
      'https://j2ld7v9jji.execute-api.us-east-1.amazonaws.com/staging'
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
