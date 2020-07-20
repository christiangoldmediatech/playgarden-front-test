export default function ({ app }) {
  return {
    theme: {
      options: {
        customProperties: true
      },
      dark: false,
      themes: {
        light: {
          primary: '#C2DAA5',
          secondary: '#E2EBBA',
          error: '#C61818',
          accent: '#FEC572',
          success: '#C5DCA6',
          black: '#606060'
        }
      }
    },
    icons: {
      iconfont: 'mdi'
    }
  }
}
