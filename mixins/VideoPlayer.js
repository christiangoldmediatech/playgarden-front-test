import { mapGetters } from 'vuex'

export default {
  data: () => {
    return {
      dialog: false,
      playlist: [],
      player: null,
      videoHeight: 0
    }
  },

  computed: {
    ...mapGetters({ children: 'getCurrentChild' }),

    videoWidth () {
      if (this.videoHeight > 0) {
        return Math.round(this.videoHeight * (16 / 9))
      }
      return 0
    }
  },

  created () {
    this.$nuxt.$on(this.eventName, (params) => {
      if (!this.dialog) {
        this.beforeOpen()
        if (this.player) {
          this.player.load(params.playlist)
          this.player.play()
        } else {
          this.playlist = params.playlist
        }
        this.open()
      }
    })
  },

  methods: {
    setPlayer () {
      this.player = this.$refs.playerRef.player
      if (this.playlist.length) {
        this.player.play()
      }
    },

    beforeOpen () {
      return true
    },

    open () {
      this.dialog = true
      this.videoHeight = window.innerHeight - 1
    },

    close () {
      const status = this.player.getState()
      if (['playing', 'buffering'].includes(status)) {
        this.player.stop()
      }
      this.dialog = false
    }
  }
}
