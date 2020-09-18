export default {
  data: () => {
    return {
      fullscreen: false
    }
  },

  mounted () {
    /* All */
    document.addEventListener('fullscreenchange', this.setFullscreenStatus)
    /* Firefox */
    document.addEventListener('mozfullscreenchange', this.setFullscreenStatus)
    /* Chrome, Safari and Opera */
    document.addEventListener('webkitfullscreenchange', this.setFullscreenStatus)
    /* IE / Edge */
    document.addEventListener('msfullscreenchange', this.setFullscreenStatus)
  },

  beforeDestroy () {
    /* All */
    document.removeEventListener('fullscreenchange', this.setFullscreenStatus)
    /* Firefox */
    document.removeEventListener('mozfullscreenchange', this.setFullscreenStatus)
    /* Chrome, Safari and Opera */
    document.removeEventListener('webkitfullscreenchange', this.setFullscreenStatus)
    /* IE / Edge */
    document.removeEventListener('msfullscreenchange', this.setFullscreenStatus)
  },

  methods: {
    setFullscreenStatus () {
      const fullscreenElement = document.fullscreenElement || document.mozFullScreenElement ||
        document.webkitFullscreenElement || document.msFullscreenElement
      if (fullscreenElement) {
        this.fullscreen = true
      } else {
        this.fullscreen = false
      }
    },

    toggleFullscreen (containerId) {
      try {
        if (document.fullscreenElement) {
          if (document.exitFullscreen) {
            document.exitFullscreen()
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
          }
        } else {
          const docElement = document.getElementById(containerId)
          if (docElement.requestFullscreen) {
            docElement.requestFullscreen()
          } else if (docElement.mozRequestFullScreen) {
            docElement.mozRequestFullScreen()
          } else if (docElement.webkitRequestFullscreen) {
            docElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
          } else if (docElement.msRequestFullscreen) {
            docElement.msRequestFullscreen()
          }
          if ('orientation' in screen) {
            screen.orientation.lock('landscape')
          }
        }
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }
}
