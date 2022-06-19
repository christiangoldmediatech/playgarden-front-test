<template>
  <div :id="containerId" class="inline-video-container">
    <div v-if="show" class="play-button-container">
      <v-hover v-slot="{ hover }">
        <div
          :class="['play-button-icon', { 'play-button-icon-scaled': hover }]"
          @click.stop="onClick"
        >
          <div class="play-button-icon-content">
            <img
              src="@/assets/svg/play-button-icon.svg"
              width="100%"
            >
          </div>
        </div>
      </v-hover>
    </div>
    <pg-video-js-player
      v-bind="$attrs"
      :fullscreen-override="handleFullscreen"
      no-smallscreen
      inline
      @ready="onPlayerReady"
      @play="show = false"
    />
  </div>
</template>

<script>
import Fullscreen from '@/mixins/FullscreenMixin.js'
import PgVideoJsPlayer from '@/components/pg-video-js-player/PgVideoJsPlayer.vue'

const excludedListeners = ['ready']

export default {
  name: 'PgInlineVideoPlayer',

  components: {
    PgVideoJsPlayer
  },

  mixins: [Fullscreen],

  data: () => {
    return {
      player: null,
      show: true
    }
  },

  computed: {
    containerId () {
      return `inline-video-player-${this._uid}`
    }
  },

  methods: {
    onPlayerReady (player) {
      this.player = player
      // attach listeners
      const listenerKeys = Object.keys(this.$listeners).filter(key => !excludedListeners.includes(key))
      listenerKeys.forEach((key) => {
        player.on(key, this.$listeners[key].fns)
      })
      this.$emit('ready', player)
    },

    onClick () {
      this.show = false
      this.player.play()
    },

    reset () {
      this.show = true
    },

    handleFullscreen () {
      this.toggleFullscreen(this.containerId)
    }
  }
}
</script>

<style lang="scss" scoped>
.inline-video {
  &-container {
    position: relative;
    width: 100%;
    height: auto;
    pointer-events: auto;
  }
}

.play-button {
  &-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    z-index: 1;
  }
  &-icon {
    position: relative;
    width: 33%;
    padding-top: calc(33% - (33% - 150px));
    max-width: 150px;
    // border-radius: 50%;
    cursor: pointer;
    // background-color: var(--v-accent-base);
    transition: transform 250ms;
    &-scaled {
      transform: scale(1.15);
    }
    &-content {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    &-text {
      font-size: 24px;
      font-weight: bold;
      color: white !important;
      letter-spacing: 0.04em;
      margin: 8px 0px;
    }
  }
}
</style>
