<template>
  <div :id="`player_${_uid}`" />
</template>

<script>
export default {
  name: 'JwPlayer',

  props: {
    file: {
      type: String,
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

  data: () => {
    return {
      player: null
    }
  },

  mounted () {
    if (jwplayer) {
      const player = jwplayer(`player_${this._uid}`)
      const config = { ...this.$props }

      player.setup(config)

      this.$emit('ready', player)

      player.on('play', (params) => {
        this.$emit('play', { player, params })
      })

      player.on('complete', (params) => {
        this.$emit('complete', { player, params })
      })

      this.player = player
    }
  }
}
</script>
