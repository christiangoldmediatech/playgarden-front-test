export default {
  methods: {
    setupPlayer (fullPlaylist) {
      this.player = jwplayer(this.playerId).setup({
        autostart: false,
        controls: false,
        playlist: fullPlaylist,
        // mute: false,
        repeat: true,
        displaytitle: false,
        displaydescription: false,
        // stretching: 'fill',
        height: '100%',
        width: '100%',
        cast: {},
        ...this.$attrs
      })

      this.player.on('play', () => { this.status = 'playing' })
      this.player.on('pause', () => { this.status = 'paused' })
      this.player.on('idle', () => { this.status = 'idle' })
      this.player.on('buffer', () => { this.status = 'buffering' })

      this.player.on('volume', (state) => {
        this.volumeVal = state.volume
      })

      this.player.on('mute', (state) => {
        this.mute = state.mute
      })

      this.player.on('time', ({ duration, position }) => {
        this.duration = duration
        this.position = position
      })

      const listenerKeys = Object.keys(this.$listeners)
      listenerKeys.forEach((key) => {
        this.player.on(key, this.$listeners[key].fns)
      })
    }
  }
}
