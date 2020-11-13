<template>
  <div class="control-bar" :class="{ 'control-bar-mobile-portrait': !inline }">
    <!-- Next Up Component -->
    <next-up :params="nextUp" />
    <v-hover v-slot="{ hover }" close-delay="500">
      <v-row class="mx-0" justify="center">
        <v-sheet
          :id="controlBarId"
          :class="['control-bar-sheet-container py-2 px-4 mx-4', { 'control-bar-sheet-show': hover || visible }, { 'control-bar-sheet-container-mobile-portrait': !inline }]"
          color="rgba(0, 0, 0, 0.74)"
          max-width="656"
          min-width="290"
          width="100%"
          rounded
        >
          <div class="d-flex justify-space-between">
            <!-- `${noSmallscreen ? 'justify-space-between' : 'justify-center justify-md-space-between'}` -->
            <!-- Volume Menu -->
            <div>
              <v-menu
                v-if="!smallScreen"
                v-model="visible"
                dark
                offset-y
                top
                open-on-hover
                open-on-focus
                open-on-click
                close-on-click
                close-on-content-click
                rounded
                :attach="`#${controlBarId}`"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="#D2D2D2"
                    icon
                    :x-large="!mobile"
                    v-bind="attrs"
                    v-on="on"
                    @click.stop="toggleMute"
                  >
                    <v-icon :small="$vuetify.breakpoint.xsOnly">
                      {{ speakerIcon }}
                    </v-icon>
                  </v-btn>
                </template>
                <v-list
                  color="rgba(0, 0, 0, 0.74)"
                  dense
                >
                  <v-list-item>
                    <v-slider
                      v-model="volumeVal"
                      class="py-2"
                      thumb-size="8"
                      color="#D2D2D2"
                      dark
                      hide-details
                      vertical
                      :min="0"
                      :max="100"
                    />
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>

            <div>
              <v-btn
                v-if="showRestart"
                class="mx-1"
                color="#D2D2D2"
                icon
                :x-large="!mobile"
                :disabled="status === 'LOADING'"
                @click.stop="restart"
              >
                <v-icon :small="$vuetify.breakpoint.xsOnly">
                  pg-icon-previous
                </v-icon>
                <!-- <img class="control-bar-svg-icon" src="/player/previous.svg" width="100%"> -->
              </v-btn>

              <!-- Step backward 15 sec -->
              <v-btn
                v-if="showSteps"
                class="mx-1"
                color="#D2D2D2"
                icon
                :x-large="!mobile"
                :disabled="status === 'LOADING'"
                @click.stop="stepBack"
              >
                <!-- <v-icon small>
                  pg-icon-backward-15-sec
                </v-icon> -->
                <img class="control-bar-svg-icon" src="/player/back15sec.svg" width="100%">
              </v-btn>

              <!-- Play Button -->
              <v-btn
                color="#D2D2D2"
                class="mx-1"
                icon
                :x-large="!mobile"
                :disabled="status === 'LOADING'"
                @click.stop="togglePlay"
              >
                <v-icon :large="$vuetify.breakpoint.smAndUp">
                  {{ playIcon }}
                </v-icon>
              </v-btn>

              <!-- Step forward 15 sec -->
              <v-btn
                v-if="showSteps"
                class="mx-1"
                color="#D2D2D2"
                icon
                :x-large="!mobile"
                :disabled="status === 'LOADING'"
                @click.stop="stepForward"
              >
                <!-- <v-icon small>
                  pg-icon-forward-15-sec
                </v-icon> -->
                <img class="control-bar-svg-icon" src="/player/forward15sec.svg" width="100%">
              </v-btn>
            </div>

            <div>
              <!-- Fullscreen Button -->
              <v-btn
                v-if="!smallScreen"
                color="#D2D2D2"
                icon
                :x-large="!mobile"
                @click.stop="$emit('fullscreen')"
              >
                <v-icon :small="$vuetify.breakpoint.xsOnly">
                  {{ fullscreenIcon }}
                </v-icon>
              </v-btn>
            </div>
          </div>

          <!-- Timeline -->
          <div class="d-flex align-center justify-space-between">
            <span class="control-bar-text">
              {{ position | convertToMMSS }}
            </span>
            <div class="flex-grow-1 flex-shrink-0">
              <v-slider
                class="no-transition control-bar-progress-slider"
                color="accent"
                track-color="#D2D2D2"
                :value="Math.round(position)"
                :max="Math.round(duration)"
                :min="0"
                thumb-color="accent"
                :readonly="noSeek"
                hide-details
                @input="seek"
              >
                <template v-slot:thumb-label="{ value }">
                  <span class="control-bar-text">
                    {{ value | convertToMMSS }}
                  </span>
                </template>
              </v-slider>
            </div>
            <span class="control-bar-text">
              {{ duration | convertToMMSS }}
            </span>
          </div>
        </v-sheet>
      </v-row>
    </v-hover>
  </div>
</template>

<script>
import SmallScreen from '@/mixins/SmallScreenMixin.js'
import ControlBarProps from './mixins/ControlBarPropsMixin.js'
import NextUp from './NextUp.vue'

export default {
  name: 'ControlBar',

  components: {
    NextUp
  },

  filters: {
    convertToMMSS (value) {
      const measuredTime = new Date(null)
      measuredTime.setSeconds(value)
      const MHSTime = measuredTime.toISOString().substr(14, 5)
      return MHSTime
    }
  },

  mixins: [SmallScreen, ControlBarProps],

  data: () => {
    return {
      visible: false
    }
  },

  computed: {
    controlBarId () {
      return `control-bar-${this._uid}`
    },

    speakerIcon () {
      if (this.muted || this.volume === 0) {
        return 'mdi-volume-off'
      }
      if (this.volume < 0.33) {
        return 'mdi-volume-low'
      }
      if (this.volume < 0.66) {
        return 'mdi-volume-medium'
      }
      return 'mdi-volume-high'
    },

    playIcon () {
      if (this.status === 'PLAYING') {
        return 'mdi-pause'
      }
      return 'mdi-play'
    },

    fullscreenIcon () {
      if (this.fullscreen) {
        return 'mdi-fullscreen-exit'
      }
      return 'mdi-fullscreen'
    },

    volumeVal: {
      get () {
        return Math.round(this.volume * 100)
      },

      set (volume) {
        this.player.volume(volume / 100)
      }
    }
  },

  methods: {
    seek (position) {
      if (this.duration > 0) {
        this.player.currentTime(position)
      }
    },

    restart () {
      this.player.currentTime(0)
    },

    stepBack () {
      const currentTime = this.player.currentTime()
      if (currentTime - 15 > 0) {
        this.player.currentTime(currentTime - 15)
      } else {
        this.player.currentTime(0)
      }
    },

    stepForward () {
      const currentTime = this.player.currentTime()
      const nextTime = currentTime + 15
      const duration = this.player.duration()
      const mediaObj = this.player.getMediaObject()
      const availTime = (mediaObj.viewed && mediaObj.viewed.time) ? mediaObj.viewed.time : currentTime

      if (nextTime < (duration - 1) && nextTime < availTime) {
        this.player.currentTime(nextTime)
      }
    },

    togglePlay () {
      if (this.status === 'PLAYING') {
        this.player.pause()
      } else {
        this.player.play()
      }
    },

    toggleMute () {
      if (this.volumeVal > 0) {
        this.volumeVal = 0
      } else {
        this.volumeVal = 100
      }
    }
  }
}
</script>

<style lang="scss">
.control-bar {
  position: absolute;
  width: 100%;
  bottom: 16px;
  user-select: none;
  pointer-events: auto;
  @media screen and (max-width: 599px) {
    bottom: 4px;
  }
  @media screen and (max-width: 599px) and (orientation:portrait) {
    &-mobile-portrait {
      bottom: -84px !important;
      z-index: 1000;
    }
  }
  &-area {
    width: calc(50% - 52px);
  }
  &-sheet {
    &-container {
      opacity: 0;
      transition: opacity 500ms ease-in-out;
      -moz-transition: opacity 500ms ease-in-out;
      -webkit-transition: opacity 500ms ease-in-out;
      @media screen and (max-width: 599px) and (orientation:portrait) {
        &-mobile-portrait {
          opacity: 1 !important;
        }
      }
    }
    &-show{
      opacity: 1.0;
    }
  }
  &-text {
    color: #D2D2D2;
    text-align: center;
    width: 60px;
  }
  &-progress-slider {
    .v-slider__thumb-label.accent {
      background-color: transparent !important;
    }
    @media screen and (max-width: 599px) {
      .v-input__control,.v-input__control > div.v-input__slot {
        min-height: 32px;
        max-height: 32px;
      }
    }
  }
  &-svg-icon {
    max-width: 32px !important;
    max-height: 32px !important;
    @media screen and (max-width: 599px) {
      max-width: 24px !important;
      max-height: 24px !important;
    }
  }
}
</style>
