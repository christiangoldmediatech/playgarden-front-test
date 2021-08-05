export default function () {
  return {
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
          secondary: '#E2EBBA',
          success: '#C5DCA6',
          green2: '#B2E68D',

          // general colors
          black: '#606060',
          white: '#FFFFFF'
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
