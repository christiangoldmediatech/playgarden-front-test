import { throttle } from 'lodash'

export default {
  data: () => ({
    winWidth: document.documentElement.clientWidth || window.innerWidth || 0,
    winHeight: document.documentElement.clientHeight || window.innerHeight || 0,
    throttledGetWindowDimensions: null,
    mql: null
  }),

  computed: {
    mobilePortrait() {
      return (
        this.$vuetify.breakpoint.xsOnly &&
        this.$vuetify.breakpoint.width < this.$vuetify.breakpoint.height
      )
    },

    dimensions() {
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

  methods: {
    getWindowDimensions() {
      // Initial window dimensions
      this.winWidth = document.documentElement.clientWidth || window.innerWidth
      this.winHeight = document.documentElement.clientHeight || window.innerHeight
    }
  },

  mounted() {
    this.throttledGetWindowDimensions = throttle(this.getWindowDimensions, 16)
    this.mql = window.matchMedia('(orientation: portrait)')

    window.addEventListener('resize', this.throttledGetWindowDimensions)

    if (this.mql) {
      this.mql.addEventListener('change', this.getWindowDimensions)
    }

    this.getWindowDimensions()
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.throttledGetWindowDimensions)
    if (this.mql) {
      this.mql.removeEventListener('change', this.getWindowDimensions)
    }
  }
}
