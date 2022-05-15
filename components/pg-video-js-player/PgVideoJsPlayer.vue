<template>
  <div :id="playerContainerId" class="vplayer-container">
    <!-- Video tag -->
    <video ref="videoPlayer" class="video-js" playsinline />

    <div class="vplayer-top-right-icons">
      <!-- ChromeCast Button -->
      <v-btn
        v-if="canCast"
        large
        icon
        @click.stop="onCastBtn"
      >
        <v-icon color="#D2D2D2">
          mdi-cast
        </v-icon>
      </v-btn>

      <!-- Favorite Button -->
      <v-btn
        v-if="showFavorite && videoId > 0"
        class="ml-2"
        :loading="favoritesLoading"
        icon
        large
        @click.stop="handleFavorites"
      >
        <v-icon color="#F5737F">
          <template v-if="isFavorite">
            mdi-heart
          </template>
          <template v-else>
            mdi-heart-outline
          </template>
        </v-icon>
      </v-btn>
    </div>

    <div v-if="isCasting" class="vplayer-casting-overlay">
      <v-btn
        class="mb-6"
        icon
        x-large
        @click.stop="playerInstance.stopCasting"
      >
        <v-icon large color="#ABABAB">
          mdi-cast-connected
        </v-icon>
      </v-btn>

      <div class="overlay-text">
        You are casting this video to your device.
      </div>
    </div>

    <!-- Controls -->
    <control-bar
      v-if="showControls"
      ref="controls"
      v-bind="{ ...controlBarProps, noSmallscreen }"
      @fullscreen="handleFullscreen"
    >
      <!-- Next Up Component -->
      <next-up :class="{ 'clickable': Boolean(onNextUpClick) }" :params="nextUp" v-bind="{ nextPatch, nextPuzzle }" @click.native="beforeNextUpClick" />
      <next-patch v-if="nextPatch" :params="nextUnlockData" />
      <next-puzzle v-if="nextPuzzle" :params="nextUnlockData" />
    </control-bar>
  </div>
</template>

<script>
import { TAG_MANAGER_EVENTS } from '@/models'
import { jsonCopy } from '@/utils/objectTools'
import { mapState, mapGetters, mapActions } from 'vuex'
import videojs from 'video.js'
import Fullscreen from '@/mixins/FullscreenMixin.js'
import Favorites from '@/mixins/FavoritesMixin.js'
import PlayerProps from './mixins/PlayerPropsMixin.js'
import ControlBar from './controls/ControlBar.vue'
import NextUp from './controls/NextUp.vue'
import NextPatch from './controls/NextPatch.vue'
import NextPuzzle from './controls/NextPuzzle.vue'

export default {
  name: 'PgVideoJsPlayer',

  components: {
    ControlBar,
    NextUp,
    NextPatch,
    NextPuzzle
  },

  mixins: [PlayerProps, Fullscreen, Favorites],

  data: () => {
    return {
      playerInstance: null,
      closePaused: false,
      playlist: [],
      mediaObject: {},
      status: 'IDLE',
      volume: 1,
      muted: false,
      position: 0,
      duration: 0,
      options: {
        nativeControlsForTouch: false,
        controls: false,
        autoplay: false,
        preload: 'auto',
        loadingSpinner: true,
        fluid: true
      },
      nextUp: {
        image: null,
        title: '',
        description: '',
        show: false,
        hasBeenSeen: false
      },
      nextUnlockData: {
        image: require('@/assets/png/test-patch.png'),
        number: 0,
        show: false,
        hasBeenSeen: false
      },
      isCasting: false,
      castLoading: false,
      MEDIA_NAMESPACE: 'urn:x-cast:com.google.cast.media',
      timeOut: null,
      videoTagUpdates: {
        id: 0,
        quarter: false,
        half: false,
        seventyFive: false
      }
    }
  },

  computed: {
    ...mapState('cast', ['castAvailable', 'castContext']),
    ...mapGetters('cast', ['getCasting', 'getStatus', 'getCurrentTime']),
    ...mapGetters('auth', ['getUserInfo']),

    showControls () {
      return Boolean(this.playerInstance && this.playerContainerId && this.playerInstance.toggleMute)
    },

    canCast () {
      return this.showCast && this.castAvailable
    },

    volumeVal: {
      get () {
        return Math.round(this.volume * 100)
      },

      set (volume) {
        this.playerInstance.volume(volume / 100)
      }
    },

    playlistItemIndex () {
      if (this.mediaObject.videoId) {
        return this.playlist.findIndex(({ videoId }) => videoId === this.mediaObject.videoId)
      }
      return null
    },

    lastPlaylistItem () {
      if (this.playlistItemIndex !== null && this.playlistItemIndex === (this.playlist.length - 1)) {
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
        noSeek: this.noSeek,
        showRestart: this.showRestart,
        showVideoSkip: this.showVideoSkip,
        showSteps: this.showSteps,
        inline: this.inline
      }
    },

    videoId () {
      if (this.mediaObject && this.mediaObject.videoId) {
        return this.mediaObject.videoId
      }
      return -1
    }
  },

  watch: {
    getCurrentTime (val) {
      if (this.isCasting && this.getCasting) {
        this.position = val
      }
    },

    getStatus (val) {
      if (this.isCasting && this.getCasting) {
        this.status = val
      }
    },

    getCasting (val) {
      if (this.isCasting && !val) {
        this.isCasting = false
        this.status = 'IDLE'
        this.playerInstance.currentTime(this.position)
      }
    }
  },

  mounted () {
    this.setup()
    this.init()
  },

  beforeDestroy () {
    if (this.playerInstance) {
      this.playerInstance.dispose()
      this.playerInstance = null
    }
  },

  methods: {
    ...mapActions('cast', ['init']),

    popControls () {
      if (this.$refs.controls) {
        this.$refs.controls.popControls()
      }
    },

    hideNextUp () {
      this.$set(this.nextUp, 'show', false)
      this.$set(this.nextUnlockData, 'show', false)
    },

    beforeNextUpClick () {
      if (this.onNextUpClick) {
        this.hideNextUp()
        this.$nextTick(() => {
          this.onNextUpClick()
        })
      }
    },

    setup () {
      this.playerInstance = videojs(this.$refs.videoPlayer, this.options, this.onPlayerReady)
    },

    async loadPlaylist (playlist, index) {
      this.playlist = jsonCopy(playlist)
      await this.loadMediaObject(index)
    },

    async loadMediaObject (index) {
      this.position = 0
      this.duration = 0.1
      if (this.playlist[index]) {
        const mediaObject = jsonCopy(this.playlist[index])
        if (this.useStandardPoster || !mediaObject.poster) {
          mediaObject.poster = process.env.testEnv === 'production' ? `${process.env.baseRouteProd}standard-video-poster.svg` : '/standard-video-poster.svg'
        }
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
        await this.playerInstance.play()
      }

      if (!this.nextUp.show && this.nextUp.hasBeenSeen) {
        this.$set(this.nextUp, 'hasBeenSeen', false)
        this.$set(this.nextUnlockData, 'hasBeenSeen', false)
      }
    },

    pushPlaylistItem (mediaObject) {
      this.playlist.push(jsonCopy(mediaObject))
    },

    onPlayerReady () {
      // Player callback events
      this.playerInstance.on(['loadstart', 'seeking', 'waiting', 'stalled'], () => {
        this.status = 'LOADING'
      })

      this.playerInstance.on(['play', 'playing'], (data) => {
        if (this.playlistItemIndex >= 0) {
          const item = this.playlist[this.playlistItemIndex]
          this.$gtm.push({
            event: TAG_MANAGER_EVENTS.VIDEO_EVENT,
            videoStatus: data.type,
            videoPercent: Math.round(this.position / this.duration * 100, 2),
            videoTitle: item.description,
            userId: this.getUserInfo.id
          })
        }
        this.status = 'PLAYING'
      })

      this.playerInstance.on('timeupdate', (data) => {
        this.status = 'PLAYING'
        this.position = this.playerInstance.currentTime()

        // GTM EVENT
        const percentage = Math.round(this.position / this.duration * 100, 2)
        const item = this.playlist[this.playlistItemIndex]
        if ([25, 50, 75].includes(percentage)) {
          // If we haven't already called this percentage on this video send the event
          if (item.videoId !== this.videoTagUpdates.id) {
            this.videoTagUpdates.id = item.videoId

            // Update events on this video
            switch (percentage) {
              case 25:
                this.videoTagUpdates.quarter = true
                break
              case 50:
                this.videoTagUpdates.half = true
                break
              case 75:
                this.videoTagUpdates.seventyFive = true
                break
            }
            this.$gtm.push({
              event: TAG_MANAGER_EVENTS.VIDEO_EVENT,
              videoStatus: data.type,
              videoPercent: percentage,
              videoTitle: item.description,
              userId: this.getUserInfo.id
            })
          } else {
            // If we haven't sent it, sent it
            let shouldSendEvent = false
            switch (percentage) {
              case 25:
                if (!this.videoTagUpdates.quarter) {
                  shouldSendEvent = true
                  this.videoTagUpdates.quarter = true
                }
                break
              case 50:
                if (!this.videoTagUpdates.half) {
                  shouldSendEvent = true
                  this.videoTagUpdates.half = true
                }
                break
              case 75:
                if (!this.videoTagUpdates.seventyFive) {
                  shouldSendEvent = true
                  this.videoTagUpdates.seventyFive = true
                }
                break
            }
            if (shouldSendEvent) {
              this.$gtm.push({
                event: TAG_MANAGER_EVENTS.VIDEO_EVENT,
                videoStatus: data.type,
                videoPercent: percentage,
                videoTitle: item.description,
                userId: this.getUserInfo.id
              })
            }
          }
        }

        // nextUp && nextPatch && nextPuzzle
        if ((this.showNextUp || this.nextPatch || this.nextPuzzle) && this.duration > 0) {
          const elapsed = this.duration - this.position
          if (window && elapsed <= 6 && !this.lastPlaylistItem && !this.nextUp.show && !this.nextUnlockData.show) {
            // Handle nextUp
            if (this.showNextUp && !this.nextUp.show && !this.nextUp.hasBeenSeen) {
              const { title, description, poster } = this.playlist[this.playlistItemIndex + 1]
              this.nextUp = {
                image: poster,
                title,
                description,
                show: true,
                hasBeenSeen: true
              }
            }

            // Handle nextPatch or nextPuzzle
            if ((this.nextPatch || this.nextPuzzle) && !this.nextUnlockData.show && !this.nextUnlockData.hasBeenSeen) {
              this.nextUnlockData = {
                image: this.nextUnlockImage,
                number: this.nextUnlockNumber,
                show: (this.nextUnlockImage && this.nextUnlockNumber && this.nextUnlockNumber > 0),
                hasBeenSeen: true
              }
            }

            // Timeout
            this.timeOut = window.setTimeout(() => {
              this.hideNextUp()
              this.$set(this.nextUp, 'hasBeenSeen', false)
              this.$set(this.nextUnlockData, 'hasBeenSeen', false)
              window.clearTimeout(this.timeOut)
              this.timeOut = null
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
        if (this.isCasting) {
          window.remotePlayer.volumeLevel = this.volume
          window.remotePlayerController.setVolumeLevel()
        }
      })

      this.playerInstance.on('durationchange', () => {
        this.duration = this.playerInstance.duration()
      })

      this.playerInstance.on(['abort', 'ended', 'pause', 'error', 'canplay', 'canplaythrough', 'stalled', 'suspend'], (data) => {
        if (this.playlistItemIndex >= 0) {
          const item = this.playlist[this.playlistItemIndex]
          this.$gtm.push({
            event: TAG_MANAGER_EVENTS.VIDEO_EVENT,
            videoStatus: data.type,
            videoPercent: Math.round(this.position / this.duration * 100, 2),
            videoTitle: item.description,
            userId: this.getUserInfo.id
          })
        }
        this.status = 'IDLE'
      })

      // Move onto next playlist item
      this.playerInstance.on('ended', () => {
        // this.playerInstance.currentTime(0)
        this.playerInstance.hasStarted(false)
        // this.playerInstance.trigger('ready')
        if (this.noAutoTrackChange) {
          return
        }
        this.playerInstance.nextVideo()
      })

      const excludeList = ['ready', 'playlist-index-change', 'last-playlist-item', 'playlist-complete']
      const listenerKeys = Object.keys(this.$listeners).filter(key => !excludeList.includes(key))

      listenerKeys.forEach((key) => {
        this.playerInstance.on(key, this.$listeners[key].fns)
      })

      // Check if lastPlaylistItem
      this.$set(this.playerInstance, 'lastPlaylistItem', () => {
        return this.lastPlaylistItem
      })

      // Custom player functions
      this.$set(this.playerInstance, 'loadPlaylist', this.loadPlaylist)
      // this.playerInstance.loadPlaylist = this.loadPlaylist

      this.$set(this.playerInstance, 'getMediaObject', () => this.mediaObject)
      // this.playerInstance.getMediaObject = () => this.mediaObject

      // Add show loading methods
      this.$set(this.playerInstance, 'showLoading', () => {
        this.playerInstance.addClass('vjs-waiting')
      })

      this.$set(this.playerInstance, 'hideLoading', () => {
        this.playerInstance.removeClass('vjs-waiting')
      })

      this.$set(this.playerInstance, 'nextVideo', () => {
        if (!this.lastPlaylistItem) {
          this.loadMediaObject(this.playlistItemIndex + 1)
        } else {
          this.$emit('playlist-complete')
        }
      })

      this.$set(this.playerInstance, 'prevVideo', () => {
        if (this.position > 5) {
          this.playerInstance.seek(0)
        } else if (this.playlistItemIndex > 0) {
          this.loadMediaObject(this.playlistItemIndex - 1)
        } else if (this.playlist.length > 0) {
          this.loadMediaObject(this.playlist.length - 1)
        }
      })

      this.$set(this.playerInstance, 'skipVideo', () => {
        this.playerInstance.trigger('skipped')
        this.$emit('video-skipped')
      })

      this.$set(this.playerInstance, 'stopCasting', () => {
        if (this.isCasting) {
          cast.framework.CastContext.getInstance().endCurrentSession(true)
          this.isCasting = false
          this.status = 'IDLE'
        }
      })

      // Player controls
      // Play or pause
      this.$set(this.playerInstance, 'togglePlay', () => {
        if (this.isCasting) {
          window.remotePlayerController.playOrPause()
          return
        }
        if (this.status === 'PLAYING') {
          this.playerInstance.pause()
        } else {
          this.playerInstance.play()
        }
      })

      this.$set(this.playerInstance, 'closePause', () => {
        this.closePaused = true
        if (this.playerInstance.paused()) {
          this.playerInstance.trigger('closed')
        } else {
          this.playerInstance.pause()
        }
      })

      this.$set(this.playerInstance, 'getClosePaused', () => {
        return this.closePaused
      })

      this.$set(this.playerInstance, 'resetClosePaused', () => {
        this.closePaused = false
      })

      // Seek
      this.$set(this.playerInstance, 'seek', (position) => {
        if (this.duration > 0) {
          if (this.isCasting) {
            window.remotePlayer.currentTime = position
            window.remotePlayerController.seek()
          } else {
            this.position = parseInt(position)
            this.playerInstance.currentTime(position)
          }
        }
      })

      // Restart video
      this.$set(this.playerInstance, 'restart', () => {
        if (this.isCasting) {
          window.remotePlayer.currentTime = 0
          window.remotePlayerController.seek()
        } else {
          this.playerInstance.currentTime(0)
        }
        this.position = 0
      })

      // Step back 10 seconds
      this.$set(this.playerInstance, 'stepBack', () => {
        let currentTime = this.playerInstance.currentTime()
        if (this.isCasting) {
          currentTime = this.position
        }
        let newTime = 0
        if (currentTime - 10 > 0) {
          newTime = currentTime - 10
        }

        if (this.isCasting) {
          window.remotePlayer.currentTime = newTime
          window.remotePlayerController.seek()
        } else {
          this.playerInstance.currentTime(newTime)
        }

        this.position = newTime
      })

      // Step forward 10 seconds
      this.$set(this.playerInstance, 'stepForward', () => {
        let currentTime = this.playerInstance.currentTime()
        if (this.isCasting) {
          currentTime = this.position
        }
        const nextTime = currentTime + 10
        const duration = this.playerInstance.duration()
        // const mediaObj = this.playerInstance.getMediaObject()
        // const availTime = (mediaObj.viewed && mediaObj.viewed.time) ? mediaObj.viewed.time : currentTime

        // if (nextTime < (duration - 1) && nextTime < availTime) {
        if (nextTime < (duration - 1)) {
          if (this.isCasting) {
            window.remotePlayer.currentTime = nextTime
            window.remotePlayerController.seek()
          } else {
            this.playerInstance.currentTime(nextTime)
          }
          this.position = nextTime
        }
      })

      // Mute or unmute
      this.$set(this.playerInstance, 'toggleMute', () => {
        if (this.isCasting) {
          window.remotePlayerController.muteOrUnmute()
          this.muted = !this.muted
          return
        }
        if (this.volumeVal > 0) {
          this.volumeVal = 0
        } else {
          this.volumeVal = 100
        }
      })

      this.$emit('ready', this.playerInstance)
    },

    handleFullscreen () {
      if (this.fullscreenOverride) {
        this.fullscreenOverride()
      } else {
        this.toggleFullscreen(this.playerContainerId)
      }
    },

    onCastBtn () {
      cast.framework.CastContext.getInstance().requestSession().then(() => {
        // let url, type
        let url
        const sources = this.mediaObject.src
        const currentTime = this.position

        this.isCasting = true

        if (Array.isArray(sources)) {
          url = sources[0].src
        } else {
          url = sources.src
        }

        const castSession = cast.framework.CastContext.getInstance().getCurrentSession()

        const mediaInfo = new chrome.cast.media.MediaInfo()
        mediaInfo.contentId = ''
        mediaInfo.contentUrl = url

        const request = new chrome.cast.media.LoadRequest(mediaInfo)

        castSession.loadMedia(request).then(
          () => {
            window.remotePlayer.currentTime = currentTime
            window.remotePlayerController.seek()
          },
          (errorCode) => {
            // eslint-disable-next-line
            console.log('Error code: ' + errorCode)
            this.isCasting = false
          }
        )
      }, (error) => {
        this.isCasting = false
        this.status = 'IDLE'
        if (error !== 'cancel') {
          Promise.reject(error)
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/video-js/vjs.scss";

.vjs-tech {
  pointer-events: none;
}

.vplayer {
  &-container {
    position: relative;
    max-width: 100%;
    max-height: 100%;
  }
  &-top-right-icons {
    position: absolute;
    top: 4px;
    right: 4px;
    z-index: 525;
  }
  &-casting-overlay {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.74);
  }
}

.overlay-text {
  color: #ABABAB !important;
}
</style>
