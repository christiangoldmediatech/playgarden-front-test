<template>
  <div class="cbar-activator" @click="throttledActivator" @mousemove="throttledActivator">
    <div class="cbar-container">
      <slot />

      <div
        class="cbar-sheet"
        :class="{ 'cbar-mobile-portrait': !inline, 'cbar-sheet-show': visible }"
      >
        <!-- Progress -->
        <input
          id="range"
          type="range"
          class="cbar-progress-slider"
          :min="0"
          :max="duration"
          :value="position"
          @input="player.seek($event.target.value)"
        >

        <!-- Buttons -->
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <!-- Previous video Button -->
            <v-btn
              v-if="showVideoSkip"
              class="mx-2"
              small
              icon
              @click.stop="player.prevVideo"
            >
              <img class="cbar-button cbar-button-small" src="@/assets/player/controls/prev-video.svg">
            </v-btn>

            <!-- Skip backward 10 secs Button -->
            <v-btn
              v-if="showSteps"
              class="mx-2"
              icon
              :small="$vuetify.breakpoint.xs"
              :disabled="status === 'LOADING'"
              @click.stop="player.stepBack"
            >
              <img class="cbar-button" src="@/assets/player/controls/go-back.svg">
            </v-btn>

            <!-- Play / Pause Button -->
            <v-btn
              icon
              class="mx-2"
              :small="$vuetify.breakpoint.xs"
              :disabled="status === 'LOADING'"
              @click.stop="player.togglePlay"
            >
              <img
                v-if="status === 'PLAYING'"
                class="cbar-button cbar-button-small"
                src="@/assets/player/controls/pause.svg"
              >
              <img
                v-else
                class="cbar-button cbar-button-small"
                src="@/assets/player/controls/play.svg"
              >
            </v-btn>

            <!-- Skip forward 10 secs Button -->
            <v-btn
              v-if="showSteps"
              class="mx-2"
              icon
              :small="$vuetify.breakpoint.xs"
              :disabled="status === 'LOADING'"
              @click.stop="player.stepForward"
            >
              <img class="cbar-button" src="@/assets/player/controls/go-forward.svg">
            </v-btn>

            <!-- Next video Button -->
            <v-btn
              v-if="showVideoSkip"
              class="mx-2"
              icon
              :small="$vuetify.breakpoint.xs"
              :disabled="status === 'LOADING'"
              @click.stop="player.skipVideo"
            >
              <img class="cbar-button cbar-button-small cbar-button-mirrored" src="@/assets/player/controls/prev-video.svg">
            </v-btn>

            <!-- Audio Level Button -->
            <div v-if="!smallScreen" class="d-flex align-center">
              <v-btn
                class="ml-4 mr-2"
                small
                icon
                @click.stop="player.toggleMute"
              >
                <img
                  v-if="muted || volume === 0"
                  class="cbar-button"
                  src="@/assets/player/controls/audio-muted.svg"
                >
                <img
                  v-else-if="volume < 0.33"
                  class="cbar-button"
                  src="@/assets/player/controls/audio-low.svg"
                >
                <img
                  v-else-if="volume < 0.66"
                  class="cbar-button"
                  src="@/assets/player/controls/audio-mid.svg"
                >
                <img
                  v-else
                  class="cbar-button"
                  src="@/assets/player/controls/audio-high.svg"
                >
              </v-btn>

              <input
                v-model="volumeVal"
                type="range"
                class="cbar-audio-slider"
                :min="0"
                :max="100"
              >
            </div>
          </div>

          <div class="d-flex align-center">
            <!-- Time section -->
            <div class="cbar-time mr-md-8">
              {{ position | convertToMMSS }} / {{ duration | convertToMMSS }}
            </div>
            <!-- Fullscreen Button -->
            <v-btn
              v-if="!smallScreen"
              icon
              :small="$vuetify.breakpoint.xs"
              @click.stop="$emit('fullscreen')"
            >
              <img class="cbar-button cbar-button-mirrored" src="@/assets/player/controls/full-screen.svg">
            </v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SmallScreen from '@/mixins/SmallScreenMixin.js'
import { throttle } from 'lodash'
import ControlBarProps from './mixins/ControlBarPropsMixin.js'

export default {
  name: 'ControlBar',

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
      visible: false,
      showChecker: null,
      throttledActivator: null
    }
  },

  computed: {
    progress () {
      if (this.duration > 0) {
        return (this.position / this.duration) * 100
      }
      return 0
    },

    controlBarId () {
      return `control-bar-${this._uid}`
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

  created () {
    this.throttledActivator = throttle(this.makeVisible, 50)
  },

  methods: {
    makeVisible () {
      this.visible = true
      if (this.showChecker) {
        window.clearTimeout(this.showChecker)
      }
      this.showChecker = window.setTimeout(() => {
        this.visible = false
        window.clearTimeout(this.showChecker)
        this.showChecker = null
      }, 3000)
    },

    popControls () {
      if (typeof this.throttledActivator === 'function') {
        this.throttledActivator()
      }
    }
  }
}
</script>

<style lang="scss">
.cbar {
  &-activator {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    user-select: none;
    pointer-events: auto;
  }
  &-container {
    position: absolute;
    width: 100%;
    bottom: 0px;
    user-select: none;
    pointer-events: auto;
    color: white;
    max-height: 100%;
  }

  &-progress-slider {
    // -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 4px;
    position: absolute;
    top: -4px;
    left: 0px;
    background-color: rgba($color: #FFFFFF, $alpha: 0.5);
    outline: none;
    overflow: hidden;

    &::-webkit-slider-thumb {
      // -webkit-appearance: none;
      appearance: none;
      width: 1px;
      height: 4px;
      background-color: var(--v-accent-base);
      box-shadow: -8000px 0 0 8000px var(--v-accent-base);
    }

    /** FF*/
    &::-moz-range-progress {
      background-color: var(--v-accent-base);
    }

    &::-moz-range-track {
      background-color: rgba($color: #FFFFFF, $alpha: 0.5);
    }

    /* IE*/
    &::-ms-fill-lower {
      background-color: var(--v-accent-base);
    }

    &::-ms-fill-upper {
      background-color: rgba($color: #FFFFFF, $alpha: 0.5);
    }
  }

  &-audio-slider {
    appearance: none;
    width: 75px;
    height: 4px;
    background-color: #FFFFFF;
    outline: none;
    margin: 0px 4px;

    &::-webkit-slider-thumb {
      appearance: none;
      width: 12px;
      height: 12px;
      border-radius: 6px;
      background-color: #FFFFFF;
    }

    // /** FF*/
    &::-moz-range-progress {
      background-color: #FFFFFF;
    }

    &::-moz-range-track {
      background-color: #3a3a3a;
      height: 100%;
    }

    // /* IE*/
    &::-ms-fill-lower {
      background-color: #FFFFFF;
    }

    &::-ms-fill-upper {
      background-color: #3a3a3a;
      height: 100%;
    }
  }

  &-sheet {
    width: 100%;
    background-color: rgba($color: #000000, $alpha: 0.4);
    padding: 4px;
    position: relative;
    opacity: 0;
    transition: opacity 500ms ease-in-out;
    &-show{
      opacity: 1.0;
    }
    @media screen and (max-width: 599px) and (orientation:portrait) {
      opacity: 1 !important;
    }
  }

  @media screen and (max-width: 599px) and (orientation:portrait) {
    &-mobile-portrait {
      position:  absolute;
      // bottom: -24px;
      bottom: -36px;
    }
  }

  &-button {
    // margin: 0 4px;
    width: 24px;
    height: 24px;
    object-fit: contain;
    object-position: center;
    &-small {
      width: 15px;
      height: 15px;
    }
    &-mirrored {
      transform: scaleX(-1);
    }
  }

  &-time {
    width: 80px;
    text-align: center;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.5;
  }
}
</style>
