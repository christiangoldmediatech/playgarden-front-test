import { mapGetters } from 'vuex'

export default {
  data: () => {
    return {
      dialog: false,
      loading: false,
      playlist: [],
      player: null,
      playerId: null,
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
    this.$nuxt.$on(this.eventName, ({ playlist }) => {
      if (!this.dialog) {
        this.beforeOpen()
        // if (this.player) {
        //   // this.player.load(playlist)
        //   // this.player.play()
        //   // console.log('Seeking to position', playlist[0])
        //   // if (playlist[0].viewed && !playlist[0].viewed.completed) {
        //   //   console.log('Seeking to position', playlist[0].viewed.time)
        //   //   this.player.seek(playlist[0].viewed.time)
        //   // } else {
        //   //   this.player.play()
        //   // }
        // } else {
        //   this.playlist = playlist
        // }
        this.playlist = playlist
        this.open()
      }
    })
  },

  beforeDestroy () {
    this.$nuxt.$off(this.eventName)
  },

  methods: {
    setPlayer () {
      this.playerId = this.$refs.playerRef.playerId
      this.player = this.$refs.playerRef.player
    },

    startPlaying ({ viewable }) {
      if (viewable === 1) {
        jwplayer(this.playerId).load(this.playlist)
        // const viewed = this.playlist[0].viewed
        // const position = this.player.getPosition()
        // if (viewed && !viewed.completed && viewed.time > position) {
        //   this.player.seek(viewed.time)
        // }
      }
      // console.log(playlist)
      // this.player.play()
      // const viewed = playlist[0].viewed
      // const position = this.player.getPosition()
      // if (viewed && !viewed.completed && viewed.time > position) {
      //   this.player.seek(playlist[0].viewed.time)
      // }
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
        // this.player.pause()
        jwplayer(this.playerId).pause()
      }
      this.dialog = false
    }
  }
}
