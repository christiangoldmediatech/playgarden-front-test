export default {
  computed: {
    playerId () {
      return `children-player-${this._uid}`
    },

    playerContainerId () {
      return `js-background-video-container-${this._uid}`
    },

    positionInTime () {
      if (this.duration > 0) {
        return (this.position / this.duration) * 100
      }
      return 0
    },

    volume: {
      get () {
        return this.volumeVal
      },
      set (val) {
        this.player.setVolume(val)
      }
    },

    speakerIcon () {
      if (this.mute) {
        return 'mdi-volume-off'
      }
      if (this.volumeVal < 33) {
        return 'mdi-volume-low'
      }
      if (this.volumeVal < 66) {
        return 'mdi-volume-medium'
      }
      return 'mdi-volume-high'
    },

    playIcon () {
      if (this.status === 'playing') {
        return 'mdi-pause'
      }
      return 'mdi-play'
    },

    fullscreenIcon () {
      if (this.fullscreen) {
        return 'mdi-fullscreen-exit'
      }
      return 'mdi-fullscreen'
    }
  }
}
