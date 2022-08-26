<template>
  <div :id="containerId" class="inline-video-container">
    <PgVideoPlayer
      v-bind="$attrs"
      inline
      :control-config="{
        prevTrack: false,
        nextTrack: false,
        favorite: false,
        unlock: false,
        cast: false,
        title: false
      }"
      default-poster=""
      :force-default-poster="false"
      @ready="onPlayerReady"
      @on-ended="showEnd = true"
    >
      <template #inline-play-icon="{ firstPlay }">
        <div v-if="firstPlay && show" class="play-button-container">
          <v-btn
            color="white"
            class="pg-bg-primary px-16 py-16"
            :small="$vuetify.breakpoint.xs"
            icon
            x-large
            elevation="1"
            @click.stop="onClick"
          >
            <v-icon size="130" class="ml-5">
              mdi-play-outline
            </v-icon>
          </v-btn>
        </div>
        <div v-if="showEnd" class="play-button-container">
          <img src="@/assets/png/play-image.png" width="20%">
          <v-hover
            v-slot="{ hover }"
            :class="$vuetify.breakpoint.mobile ? 'mt-2 mb-2' : 'mt-4 mb-4'"
          >
            <v-btn
              color="accent"
              :class="['play-button-icon', { 'play-button-icon-scaled': hover }]"
              :small="$vuetify.breakpoint.xs"
              @click.stop="goToVirtualPreschool"
            >
              START LEARNING
            </v-btn>
          </v-hover>

          <v-hover v-slot="{ hover }">
            <v-btn
              color="--v-error-base"
              :class="[
                'play-button-icon replay-btn',
                { 'play-button-icon-scaled replay-btn': hover }
              ]"
              :small="$vuetify.breakpoint.xs"
              @click.stop="onClick"
            >
              <v-icon left>
                mdi-replay
              </v-icon>
              Replay
            </v-btn>
          </v-hover>
        </div>
      </template>
    </PgVideoPlayer>
  </div>
</template>

<script>
import PgVideoPlayer from '@gold-media-tech/pg-video-player'
import { mapActions } from 'vuex'
const excludedListeners = ['ready']

export default {
  name: 'PgOnboardingVideoPlayer',

  components: {
    PgVideoPlayer
  },

  data: () => {
    return {
      player: null,
      show: true,
      showEnd: false
    }
  },

  computed: {
    containerId() {
      return `inline-video-player-${this._uid}`
    }
  },

  methods: {
    ...mapActions('auth', ['updateAuthOnboarding']),

    onPlayerReady(player) {
      this.player = player
      // attach listeners
      const listenerKeys = Object.keys(this.$listeners).filter(
        key => !excludedListeners.includes(key)
      )
      listenerKeys.forEach((key) => {
        player.el.on(key, this.$listeners[key].fns)
      })
      this.$emit('ready', player)
    },

    onClick() {
      this.show = false
      this.showEnd = false
      this.player.play()
    },

    reset() {
      this.show = true
    },

    async goToVirtualPreschool() {
      try {
        await this.updateAuthOnboarding()

        this.$router.push({ name: 'app-virtual-preschool' })
      } catch (e) {
      } finally {
        this.finishing = false
      }
    },

    handleFullscreen() {
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
    pointer-events: auto;
    aspect-ratio: 16/9;
  }
}

.title-video {
  color: #ffffff;
  font-weight: bold !important;
}

.replay-btn {
  background-color: var(--v-accent-lighten2) !important;
  color: white !important;
}

.play-button {
  &-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
    padding-top: 0 !important;
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
  }
}
</style>
