<template>
  <div class="control-container d-flex align-end justify-center">
    <v-hover v-slot="{ hover }">
      <v-sheet
        :class="['sheet-container mb-5 py-2 px-4', { 'sheet-show': hover || visible || $vuetify.breakpoint.mobile }]"
        color="rgba(0, 0, 0, 0.74)"
        max-width="656"
        min-width="290"
        width="100%"
        rounded
      >
        <div class="d-flex justify-space-between">
          <v-menu
            v-if="!$vuetify.breakpoint.mobile"
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

          <v-btn
            color="#D2D2D2"
            icon
            x-large
            :disabled="status === 'LOADING'"
            @click.stop="togglePlay"
          >
            <v-icon x-large>
              {{ playIcon }}
            </v-icon>
          </v-btn>

          <div>
            <!-- TODO: refactor favorites mixin to avoid ugly workarounds -->
            <v-btn
              v-if="activity.id !== null"
              icon
              large
              :loading="loading"
              @click.stop="setFavorite"
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
        </div>
        <div class="d-flex align-center justify-space-between">
          <span class="player-grey-text">
            {{ position | convertToMMSS }}
          </span>
          <div class="flex-grow-1 flex-shrink-0">
            <v-slider
              class="no-transition"
              :value="Math.round(position)"
              :max="Math.round(duration)"
              :min="0"
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
    </v-hover>
  </div>
</template>

<script>
import VideoFavoriteMixin from '@/components/app/activities/VideoFavoriteMixin.js'

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

  mixins: [VideoFavoriteMixin],

  props: {
    playerContainerId: {
      type: String,
      required: true
    },

    player: {
      type: Object,
      required: true
    },

    status: {
      type: String,
      required: true
    },

    position: {
      type: Number,
      required: true
    },

    duration: {
      type: Number,
      required: true
    },

    volume: {
      type: Number,
      required: true
    },

    muted: {
      type: Boolean,
      required: true
    },

    fullscreen: {
      type: Boolean,
      required: true
    },

    toggleFullscreen: {
      type: Function,
      required: true
    },

    videoId: {
      required: true,
      validator: (val) => {
        return val === null || typeof val === 'number'
      }
    }
  },

  data: () => {
    return {
      visible: false
    }
  },

  computed: {
    // TODO: refactor favorites mixin to avoid ugly workarounds
    activity () {
      return {
        id: this.videoId
      }
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

<style lang="scss" scoped>
.sheet-container {
  opacity: 0.0;
  transition: opacity 500ms ease-in-out;
  -moz-transition: opacity 500ms ease-in-out;
  -webkit-transition: opacity 500ms ease-in-out;
}

.sheet-show {
  opacity: 1.0;
}

.player-grey-text {
  color: #D2D2D2;
  text-align: center;
  width: 60px;
}

.clip {
  overflow: hidden !important;
}
</style>
