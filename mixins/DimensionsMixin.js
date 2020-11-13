export default {
  computed: {
    winWidth () {
      if (this.$vuetify.breakpoint.width) {
        return document.documentElement.clientWidth || window.innerWidth || 0
      }
      return 0
    },

    winHeight () {
      if (this.$vuetify.breakpoint.height) {
        return document.documentElement.clientHeight || window.innerHeight || 0
      }
      return 0
    },

    mobilePortrait () {
      return (this.$vuetify.breakpoint.width < this.$vuetify.breakpoint.height)
    },

    dimensions () {
      const aspectRatio = 16 / 9
      let width = this.winWidth
      let height = Math.round(this.winWidth / aspectRatio)

      if (height > this.winHeight) {
        width = Math.round(this.winHeight * aspectRatio)
        height = this.winHeight
      }

      return {
        '--containerWidth': `${width}px`,
        '--containerHeight': `${height}px`,
        '--containerMarginTop': `-${height / 2}px`,
        '--containerMarginLeft': `-${width / 2}px`
      }
    }
  }
}
