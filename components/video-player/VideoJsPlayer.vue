<template>
  <video ref="videoPlayer" class="video-js" />
</template>

<script>
import videojs from 'video.js'

export default {
  name: 'VideoJsPlayer',

  props: {
    options: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
    }
  },

  data: () => {
    return {
      player: null,
      defaultOptions: {
        controls: true,
        fluid: true,
        autoplay: false,
        preload: 'auto',
        aspectRatio: '16:9',
        sources: [],
        controlBar: {
          pictureInPictureToggle: false
        }
      }
    }
  },

  mounted () {
    const options = { ...this.defaultOptions, ...this.options }
    this.player = videojs(this.$refs.videoPlayer, options, this.onPlayerReady)
  },

  beforeDestroy () {
    if (this.player) {
      this.player.dispose()
      this.player = null
    }
  },

  methods: {
    onPlayerReady () {
      const listenerKeys = Object.keys(this.$listeners)
      const readyIndex = listenerKeys.findIndex(val => val === 'ready')

      if (readyIndex >= 0) {
        listenerKeys.splice(readyIndex, 1)
      }

      listenerKeys.forEach((key) => {
        this.player.on(key, this.$listeners[key].fns)
      })

      this.$emit('ready', this.player)
    }
  }
}
</script>
