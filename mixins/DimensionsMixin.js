export default {
  data: () => {
    return {
      winWidth: 0,
      winHeight: 0
    }
  },

  computed: {
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
  },

  mounted () {
    this.getWindowDimensions()
    window.addEventListener('resize', this.getWindowDimensions)
  },

  methods: {
    getWindowDimensions () {
      this.winWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
      this.winHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    }
  }
}
