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
          accent: '#F89838',
          error: '#C61818',
          primary: '#C2DAA5',
          secondary: '#E2EBBA',
          success: '#C5DCA6',

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
