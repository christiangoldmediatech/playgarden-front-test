<template>
  <v-responsive :id="playerContainerId" class="video-background" :aspect-ratio="16/9">
    <div class="background-video-container">
      <div :id="playerId" />
    </div>
    <div class="content d-flex flex-column align-center justify-end">
      <v-row class="w-100">
        <span
          v-if="$vuetify.breakpoint.mdAndUp"
          class="ma-3"
        >
          Press CMND + SHIFT + E to EXIT
        </span>
        <v-spacer />
        <v-btn
          v-if="$vuetify.breakpoint.smAndDown"
          class="ma-2"
          color="rgba(0, 0, 0, 0.74)"
          fab
          x-small
          @click.stop="$emit('hotkey')"
        >
          <v-icon color="white">
            mdi-close
          </v-icon>
        </v-btn>
      </v-row>
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
            :attach="`#${playerContainerId}`"
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
              {{ playIcon }}
            </v-icon>
          </v-btn>

          <v-btn
            color="#D2D2D2"
            icon
            x-large
            @click.stop="toggleFullscreen"
          >
            <v-icon x-large>
              {{ fullscreenIcon }}
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
import ComputedMixin from './ComputedMixin'
import SetupMixin from './SetupMixin'
import MethodsMixin from './MethodsMixin'

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

  mixins: [ComputedMixin, SetupMixin, MethodsMixin],

  props: {
    playlist: {
      type: Array,
      required: true
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
      status: 'idle'
    }
  },

  mounted () {
    this.setupPlayer(this.playlist)

    this._keyListener = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
        e.preventDefault()
        this.$emit('hotkey')
      }
    }

    document.addEventListener('keydown', this._keyListener.bind(this))
  },

  beforeDestroy () {
    this.player.remove()
    this.player = undefined
    document.removeEventListener('keydown', this._keyListener)
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
  overflow: hidden;
  position: relative;
}

.background-video-container {
  background: 50% 50% / cover no-repeat;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}

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
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.clip {
  overflow: hidden !important;
}
</style>
