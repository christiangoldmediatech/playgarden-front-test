<template>
  <v-responsive :id="playerContainerId" class="video-background" :aspect-ratio="16/9">
    <div class="background-video-container">
      <div :id="playerId" />
    </div>
    <div class="content d-flex flex-column align-center justify-end">
      <div class="d-flex align-center justify-center flex-grow-1 flex-shrink-0">
        <v-progress-circular v-if="status === 'buffering'" width="6" size="128" color="accent" indeterminate />
      </div>
      <v-sheet
        class="mb-5 py-2 px-4"
        color="rgba(0, 0, 0, 0.74)"
        max-width="656"
        min-width="290"
        width="100%"
        rounded
      >
        <div class="d-flex justify-space-between">
          <v-menu
            dark
            offset-y
            top
            open-on-hover
            open-on-focus
            open-on-click
            close-on-click
            close-on-content-click
            rounded
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="#D2D2D2"
                icon
                x-large
                v-bind="attrs"
                v-on="on"
                @click.stop="toggleMute"
              >
                <v-icon x-large>
                  {{ speakerIcon }}
                </v-icon>
              </v-btn>
            </template>
            <v-slider
              v-model="volume"
              class="py-2 clip"
              background-color="rgba(0, 0, 0, 0.74)"
              thumb-size="8"
              color="#D2D2D2"
              dark
              hide-details
              vertical
            />
          </v-menu>

          <v-btn
            color="#D2D2D2"
            icon
            x-large
            :disabled="status === 'buffering'"
            @click.stop="togglePlay"
          >
            <v-icon x-large>
              <template v-if="status === 'playing'">
                mdi-pause
              </template>
              <template v-else>
                mdi-play
              </template>
            </v-icon>
          </v-btn>

          <v-btn
            color="#D2D2D2"
            icon
            x-large
            @click.stop="toggleFullscreen"
          >
            <v-icon x-large>
              <template v-if="fullscreen">
                mdi-fullscreen-exit
              </template>
              <template v-else>
                mdi-fullscreen
              </template>
            </v-icon>
          </v-btn>
        </div>
        <div class="d-flex align-center justify-space-between">
          <span class="player-grey-text">
            {{ position | convertToMMSS }}
          </span>
          <div class="flex-grow-1 flex-shrink-0">
            <v-slider
              class="no-transition"
              :value="positionInTime"
              color="#D2D2D2"
              hide-details
              readonly
            />
          </div>
          <span class="player-grey-text">
            {{ duration | convertToMMSS }}
          </span>
        </div>
      </v-sheet>
    </div>
  </v-responsive>
</template>

<script>
export default {
  name: 'ChildrenJwPlayer',

  filters: {
    convertToMMSS (value) {
      const measuredTime = new Date(null)
      measuredTime.setSeconds(value)
      const MHSTime = measuredTime.toISOString().substr(14, 5)
      return MHSTime
    }
  },

  data: () => {
    return {
      player: null,
      volumeVal: 100,
      mute: false,
      duration: 0,
      position: 0,
      fullscreen: false,
      status: 'IDLE'
    }
  },

  computed: {
    playerId () {
      return `children-player-${this._uid}`
    },

    playerContainerId () {
      return `js-background-video-container-${this._uid}`
    },

    positionInTime () {
      if (this.duration > 0) {
        return (this.position / this.duration) * 100
      }
      return 0
    },

    volume: {
      get () {
        return this.volumeVal
      },
      set (val) {
        this.player.setVolume(val)
      }
    },

    speakerIcon () {
      if (this.mute) {
        return 'mdi-volume-off'
      }
      if (this.volumeVal < 33) {
        return 'mdi-volume-low'
      }
      if (this.volumeVal < 66) {
        return 'mdi-volume-medium'
      }
      return 'mdi-volume-high'
    }
  },

  mounted () {
    fetch('https://cdn.jwplayer.com/v2/media/1b02B03R').then(r => r.json()).then((data) => {
      this.setupPlayer(data.playlist)
    })
  },

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
    },

    togglePlay () {
      try {
        const state = this.player.getState()
        if (['playing', 'buffering'].includes(state)) {
          this.player.pause()
        } else {
          this.player.play()
        }
      } catch (error) {
        return Promise.reject(error)
      }
    },

    toggleFullscreen () {
      try {
        if (this.fullscreen) {
          if (document.exitFullscreen) {
            document.exitFullscreen()
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
          }
          this.fullscreen = false
        } else {
          const videoElement = document.getElementById(this.playerContainerId)
          if (videoElement.requestFullscreen) {
            videoElement.requestFullscreen()
          } else if (videoElement.mozRequestFullScreen) {
            videoElement.mozRequestFullScreen()
          } else if (videoElement.webkitRequestFullscreen) {
            videoElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
          } else if (videoElement.msRequestFullscreen) {
            videoElement.msRequestFullscreen()
          }
          this.fullscreen = true
        }
      } catch (error) {
        return Promise.reject(error)
      }
    },

    toggleMute () {
      this.player.setMute()
    }
  }
}
</script>

<style lang="scss" scoped>
.no-transition .v-slider__thumb-container {
  transition: none !important;
}

.player-grey-text {
  color: #D2D2D2;
  text-align: center;
  width: 60px;
}

.video-background {
  // font-family: "Lato";
  // align-items: center;
  // display: flex;
  // height: 80vmin;
  // justify-content: center;
  overflow: hidden;
  position: relative;
}

// .ds-button--primary {
//   text-decoration: none;
// }

.background-video-container {
  background: 50% 50% / cover no-repeat;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}

// .background-video-container::after {
//   background-color: rgba(61, 56, 65, 0.75);
//   content: "";
//   height: 100%;
//   left: 0;
//   mix-blend-mode: multiply;
//   position: absolute;
//   top: 0;
//   width: 100%;
// }

// .background-video-container .jwplayer {
//   transition: opacity 1s ease-in-out;
// }

// .background-video-container.is-fading .jwplayer {
//   opacity: 0;
// }

.background-video-container .jwplayer.jw-flag-aspect-mode {
  height: 100% !important;
}

.background-video-container .jw-state-playing {
  opacity: 1;
}

.jwplayer.jw-stretch-uniform video {
  object-fit: cover;
}

.jw-nextup-container {
  display: none;
}

.video-background .content {
  // color: #fff;
  position: relative;
  // text-align: center;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.clip {
  overflow: hidden !important;
}
</style>
