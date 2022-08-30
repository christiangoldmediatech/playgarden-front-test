module.exports = {
  mode: 'jit',
  prefix: 'pg-',
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}'
  ],
  theme: {
    // https://vuetifyjs.com/en/features/breakpoints/#breakpoint-service
    screens: {
      sm: '600px',
      md: '960px',
      lg: '1264px',
      xl: '1904px'
    },
    // vuetify.options.js
    colors: {
      accent: '#FFAB37',
      error: '#C61818',
      primary: '#68C453',
      secondary: '#B2E68D',
      success: '#C5DCA6',
      green2: '#B2E68D',
      black: '#606060',
      white: '#FFFFFF',
      'pg-grey': '#606060'
    },
    extend: {
      boxShadow: {
        toolbar: '0px 3px 46px rgba(0, 0, 0, 0.160784)',
        button: '0px 3px 6px rgba(0, 0, 0, 0.160784)'
      }
    }
  },
  plugins: []
}
