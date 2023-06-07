export default function () {
  return {
    breakpoint: {
      threshold: {
        xs: 599,
        sm: 959,
        md: 1300,
        lg: 1903
      }
    },
    theme: {
      options: {
        customProperties: true
      },
      dark: false,
      themes: {
        light: {
          // vuetify shortcut colors
          accent: '#FFAB37',
          error: '#C61818',
          primary: '#68C453',
          secondary: '#B2E68D',
          success: '#C5DCA6',
          green2: '#B2E68D',

          // general colors
          black: '#606060',
          white: '#FFFFFF',
          'pg-grey': '#606060'
        }
      }
    },
    icons: {
      iconfont: 'mdi',
      values: {
        pgDownload: 'e901'
      }
    }
  }
}
