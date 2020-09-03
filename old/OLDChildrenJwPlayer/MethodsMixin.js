export default {
  methods: {
    togglePlay () {
      try {
        const state = this.player.getState()
        if (['playing', 'buffering'].includes(state)) {
          this.player.pause()
        } else {
          this.player.play()
        }
      } catch (error) {
        return Promise.reject(error)
      }
    },

    toggleFullscreen () {
      try {
        if (this.fullscreen) {
          if (document.exitFullscreen) {
            document.exitFullscreen()
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
          }
          this.fullscreen = false
        } else {
          const videoElement = document.getElementById(this.playerContainerId)
          if (videoElement.requestFullscreen) {
            videoElement.requestFullscreen()
          } else if (videoElement.mozRequestFullScreen) {
            videoElement.mozRequestFullScreen()
          } else if (videoElement.webkitRequestFullscreen) {
            videoElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
          } else if (videoElement.msRequestFullscreen) {
            videoElement.msRequestFullscreen()
          }
          this.fullscreen = true
        }
      } catch (error) {
        return Promise.reject(error)
      }
    },

    toggleMute () {
      this.player.setMute()
    }
  }
}
