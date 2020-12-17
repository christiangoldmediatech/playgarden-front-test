<template>
  <div :id="containerId" class="inline-video-container">
    <div v-if="show" class="play-button-container">
      <img
        src="@/assets/svg/play-image.svg"
        width="20%"
      >
      <p class="text-center pt-3">
        <span class="title-video text-md-h5">Watch a video on how to use our online preschool!</span>
      </p>
      <v-hover v-slot="{ hover }" class="pt-10">
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
    <div v-if="showEnd" class="play-button-container background-video-end">
      <img
        src="@/assets/svg/play-image.svg"
        width="20%"
      >
      <v-hover v-slot="{ hover }" class="pt-12">
        <div
          :class="['play-button-icon', { 'play-button-icon-scaled': hover }]"
          @click.stop="goLessons"
        >
          <div class="play-button-icon-content">
            <img
              src="@/assets/svg/play-button-lessons.svg"
              width="100%"
            >
          </div>
        </div>
      </v-hover>
      <v-hover v-slot="{ hover }" :class="(!$vuetify.breakpoint.mobile) ? 'pt-12' : 'pt-2'">
        <div
          :class="['play-button-icon', { 'play-button-icon-scaled': hover }]"
          @click.stop="onClick"
        >
          <div class="play-button-icon-content">
            <img
              src="@/assets/svg/play-button-replay.svg"
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
      @ended="showEnd = true"
    />
  </div>
</template>

<script>
import Fullscreen from '@/mixins/FullscreenMixin.js'
const excludedListeners = ['ready']

export default {
  name: 'PgInlineVideoPlayer',

  mixins: [Fullscreen],

  data: () => {
    return {
      player: null,
      show: true,
      showEnd: false
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
      this.showEnd = false
      this.player.play()
    },

    reset () {
      this.show = true
    },

    goLessons () {
      this.$router.push({ name: 'app-dashboard' })
    },

    handleFullscreen () {
      this.toggleFullscreen(this.containerId)
    }
  }
}
</script>

<style lang="scss">
.inline-video {
  &-container {
    position: relative;
    width: 100%;
    height: auto;
    pointer-events: auto;
  }
}

.background-video-end {
  // background-image: url("~assets/svg/play-end-video.svg") !important;
  // opacity: 0.6;
}

.title-video {
  color: #FFFFFF;
  font-weight: bold !important;
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
    flex-direction: column;
    justify-content: center;
    user-select: none;
    z-index: 1;
  }
  &-icon {
    position: relative;
    width: 33%;
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
