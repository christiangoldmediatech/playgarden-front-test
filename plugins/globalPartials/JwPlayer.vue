<template>
  <div :id="`player_${_uid}`" />
</template>

<script>
export default {
  name: 'JwPlayer',

  props: {
    file: {
      type: [Object, String],
      required: false,
      default: undefined
    },
    autostart: {
      type: Boolean,
      required: false,
      default: false
    },
    playlist: {
      type: Array,
      required: false,
      default: undefined
    },
    image: {
      type: String,
      required: false,
      default: () => {
        const images = ['child1.png', 'child2.png', 'child3.png', 'child4.png']
        const index = Math.floor(Math.random() * 4)
        return require(`@/assets/png/player/${images[index]}`)
      }
    },
    description: {
      type: String,
      required: false,
      default: undefined
    },
    title: {
      type: String,
      required: false,
      default: undefined
    },
    nextUpDisplay: {
      type: Boolean,
      required: false,
      default: false
    },
    preload: {
      type: String,
      required: false,
      validator: (value) => {
        return ['none', 'metadata', 'auto'].includes(value) !== -1
      },
      default: 'metadata'
    },
    cast: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
    }
  },

  data: () => ({
    player: null
  }),

  computed: {
    _file () {
      if (this.file) {
        return this.file.HLS || this.file
      }

      return undefined
    }
  },

  mounted () {
    if (window.jwplayer) {
      const player = window.jwplayer(`player_${this._uid}`)
      const config = { ...this.$props, file: this._file }

      // setTimeout(() => {
      player.setup(config)

      this.$emit('ready', player)

      player.on('play', (params) => {
        this.$emit('play', { player, params })
      })

      player.on('pause', (params) => {
        this.$emit('play', { player, params })
      })

      player.on('complete', (params) => {
        this.$emit('complete', { player, params })
      })

      player.on('beforeComplete', (params) => {
        this.$emit('beforeComplete', { player, params })
      })

      player.on('seek', (params) => {
        this.$emit('seek', { player, params })
      })

      player.on('playlistComplete', (params) => {
        this.$emit('playlistComplete', { player, params })
      })

      this.player = player
      // }, 250)
    }
  },

  beforeDestroy () {
    if (this.player) {
      this.player.remove()
    }
    this.player = null
  }
}
</script>
