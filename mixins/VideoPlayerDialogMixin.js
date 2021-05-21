import { jsonCopy } from '@/utils/objectTools'

export default {
  data: () => {
    return {
      dialog: false,
      player: null,
      playlist: [],
      index: 0
    }
  },

  computed: {
    currentVideo () {
      return this.playlist[this.index] || null
    },

    dialogContainerId () {
      return `video-player-dialog-${this._uid}`
    },

    lastVideo () {
      return this.index === (this.playlist.length - 1)
    }
  },

  methods: {
    open ({ playlist, index }) {
      this.dialog = true
      this.playlist = jsonCopy(playlist)
      this.index = index
      // Load new media
      this.$nextTick(() => {
        // Force fullscreen on small and mobile devices
        if (this.$vuetify.breakpoint.mobile || this.$vuetify.breakpoint.smAndDown) {
          if (!this.fullscreen) {
            this.toggleFullscreen(this.dialogContainerId)
          }
        }

        if (!this.player) {
          const waitAndLoad = window.setInterval(() => {
            if (this.player) {
              this.$refs.videoPlayer.loadPlaylist(playlist, index)
              window.clearInterval(waitAndLoad)
            }
          }, 50)
        } else {
          this.$refs.videoPlayer.loadPlaylist(playlist, index)
        }
      })
    },

    handleClose () {
      if (this.fullscreen) {
        this.toggleFullscreen(this.dialogContainerId)
      }
      this.player.closePause()
      this.player.stopCasting()
    },

    handleFullscreen () {
      this.toggleFullscreen(this.dialogContainerId)
    }
  }
}
