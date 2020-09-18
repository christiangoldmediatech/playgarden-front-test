<template>
  <div :id="playerContainerId" class="video-player-container">
    <video ref="videoPlayer" class="video-js" />
    <!-- Controls -->
    <control-bar
      v-if="playerInstance && playerContainerId"
      v-bind="{ ...controlBarProps }"
      @fullscreen="handleFullscreen"
    />
  </div>
</template>

<script>
import { jsonCopy } from '@/utils/objectTools.js'
import videojs from 'video.js'
import Fullscreen from '@/mixins/FullscreenMixin.js'
import PlayerProps from './mixins/PlayerPropsMixin.js'
import ControlBar from './controls/ControlBar.vue'

export default {
  name: 'PgVideoJsPlayer',

  components: {
    ControlBar
  },

  mixins: [PlayerProps, Fullscreen],

  data: () => {
    return {
      playerInstance: null,
      playlist: [],
      mediaObject: {},
      status: 'IDLE',
      volume: 100,
      muted: false,
      position: 0,
      duration: 0,
      options: {
        controls: false,
        autoplay: false,
        preload: 'auto',
        sources: [],
        loadingSpinner: true,
        fluid: true
      },
      nextUp: {
        image: null,
        title: '',
        description: '',
        show: false
      }
    }
  },

  computed: {
    playlistItemIndex () {
      if (this.mediaObject.videoId) {
        return this.playlist.findIndex(({ videoId }) => videoId === this.mediaObject.videoId)
      }
      return null
    },

    lastPlaylistItem () {
      if (this.playlistItemIndex && this.playlistItemIndex === (this.playlist.length - 1)) {
        return true
      }
      return false
    },

    playerContainerId () {
      return `player-container-${this._uid}`
    },

    controlBarProps () {
      return {
        player: this.playerInstance,
        status: this.status,
        position: this.position,
        duration: this.duration,
        fullscreen: this.fullscreen,
        volume: this.volume,
        muted: this.muted,
        nextUp: this.nextUp,
        noSeek: this.noSeek
      }
    }
  },

  mounted () {
    this.setup()
  },

  beforeDestroy () {
    if (this.playerInstance) {
      this.playerInstance.dispose()
      this.playerInstance = null
    }
  },

  methods: {
    setup () {
      this.playerInstance = videojs(this.$refs.videoPlayer, this.options, this.onPlayerReady)
    },

    loadPlaylist (playlist, index) {
      this.playlist = jsonCopy(playlist)
      this.loadMediaObject(index)
    },

    loadMediaObject (index) {
      this.position = 0
      this.duration = 0.1
      if (this.playlist[index]) {
        const mediaObject = jsonCopy(this.playlist[index])
        this.mediaObject = mediaObject
        this.playerInstance.loadMedia(mediaObject)
      } else {
        return
      }

      this.$emit('playlist-index-change', index)

      if (this.lastPlaylistItem) {
        this.$emit('last-playlist-item')
      }

      if (this.autoplay) {
        if (this.mediaObject.viewed && this.mediaObject.viewed.time && !this.mediaObject.viewed.completed) {
          this.playerInstance.currentTime(this.mediaObject.viewed.time)
        }
        this.playerInstance.play()
      }
    },

    pushPlaylistItem (mediaObject) {
      this.playlist.push(jsonCopy(mediaObject))
    },

    onPlayerReady () {
      // Setup events
      this.playerInstance.on(['loadstart', 'seeking', 'waiting', 'stalled'], () => {
        this.status = 'LOADING'
      })

      this.playerInstance.on(['play', 'playing'], () => {
        this.status = 'PLAYING'
      })

      this.playerInstance.on('timeupdate', () => {
        this.status = 'PLAYING'
        this.position = this.playerInstance.currentTime()

        if (this.showNextUp && this.duration > 0) {
          const elapsed = this.duration - this.position
          if (elapsed <= 6 && !this.lastPlaylistItem && !this.nextUp.show) {
            const { title, description, poster } = this.playlist[this.playlistItemIndex + 1]
            this.nextUp = {
              image: poster,
              title,
              description,
              show: true
            }
            const timeOut = window.setTimeout(() => {
              this.$set(this.nextUp, 'show', false)
              window.clearTimeout(timeOut)
            }, 7500)
          }
        }
      })

      this.playerInstance.on('volumechange', () => {
        this.volume = this.playerInstance.volume()
        if (this.volume === 0) {
          this.muted = true
        } else {
          this.muted = false
        }
      })

      this.playerInstance.on('durationchange', () => {
        this.duration = this.playerInstance.duration()
      })

      this.playerInstance.on(['abort', 'ended', 'pause', 'error', 'canplay', 'canplaythrough', 'stalled', 'suspend'], () => {
        this.status = 'IDLE'
      })

      // Move onto next playlist item
      this.playerInstance.on('ended', () => {
        if (!this.lastPlaylistItem && this.position === this.duration) {
          this.loadMediaObject(this.playlistItemIndex + 1)
        } else {
          this.$emit('playlist-complete')
        }
      })

      const excludeList = ['ready', 'playlist-index-change', 'last-playlist-item', 'playlist-complete']
      const listenerKeys = Object.keys(this.$listeners).filter(key => !excludeList.includes(key))

      listenerKeys.forEach((key) => {
        this.playerInstance.on(key, this.$listeners[key].fns)
      })

      this.$emit('ready', this.playerInstance)
    },

    handleFullscreen () {
      if (this.fullscreenOverride) {
        this.fullscreenOverride()
      } else {
        this.toggleFullscreen(this.playerContainerId)
      }
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/video-js/video-js-compact";

.vjs-tech {
  pointer-events: none;
}

.video-player {
  &-container {
    position: relative;
    max-width: 100%;
    max-height: 100%;
    overflow: hidden;
  }
}
</style>
