export default {
  computed: {
    dialogContainerId () {
      return `video-player-dialog-${this._uid}`
    }
  },

  methods: {
    onReady (player) {
      this.player = player
    },

    handleClose () {
      if (this.fullscreen) {
        this.toggleFullscreen(this.dialogContainerId)
      }
      this.player.pause()
    },

    handleFullscreen () {
      this.toggleFullscreen(this.dialogContainerId)
    }
  }
}
