<template>
  <v-main class="watercolor-background">
    <v-row no-gutters class="fill-height pt-16">
      <v-col cols="12">
        <welcome-overlay v-model="viewOverlay" />
        <v-row no-gutters>
          <v-col cols="12">
            <v-row no-gutters justify="center" class="mb-6">
              <h1 class="welcome-title">
                Welcome to Playgarden Online!
              </h1>
            </v-row>

            <v-row justify="center">
              <v-card class="d-flex flex-column welcome-content-card elevation-0">
                <pg-loading :loading="loadingVideo">
                  <pg-video-player
                    class="welcome-inline-player"
                    inline
                    :control-config="{
                      prevTrack: false,
                      nextTrack: false,
                      favorite: false,
                    }"
                    @ready="onPlayerReady"
                    @on-fullscreen-change="handleFullscreenChange"
                    v-on="playerEvents"
                  >
                    <template #inline-play-icon="{ firstPlay }">
                      <div
                        class="player-preview-container"
                        :class="{
                          'player-preview-container-shown': showPreview
                        }"
                        @click="handlePlay(firstPlay)"
                      >
                        <v-hover v-slot="{ hover }">
                          <img
                            :class="['play-icon no-background', { 'scaled-play-icon': hover }]"
                            src="@/assets/svg/simple-play.svg"
                            width="100%"
                          >
                        </v-hover>
                      </div>
                    </template>
                  </pg-video-player>
                </pg-loading>
              </v-card>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-main>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@nuxtjs/composition-api'
import WelcomeOverlay from '@/components/app/WelcomeOverlay.vue'
// @ts-ignore
import PgVideoPlayer from '@gold-media-tech/pg-video-player'
import { PlayerInstance } from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'
import { useRegisterFlow } from '../../composables/use-register-flow.composable'

export default defineComponent({
  name: 'Welcome',
  components: {
    WelcomeOverlay,
    PgVideoPlayer
  },
  setup() {
    const isFullscreen = ref(false)
    const showPreview = ref(true)
    const player = ref<PlayerInstance | null>(null)
    const {
      viewOverlay,
      loadingVideo,
      welcomeVideo,
      changeViewOverlayStatus,
      playerEvents,
      getWelcomeVideo
    } = useRegisterFlow()

    const onPlayerReady = (playerInstance: PlayerInstance) => {
      player.value = playerInstance
      player.value.loadPlaylist(welcomeVideo.value)
    }

    const handleFullscreenChange = (val: boolean): void => {
      isFullscreen.value = val
      const htmlElem = document.querySelector('html')
      if (htmlElem) {
        htmlElem.style.backgroundColor = val ? '#000000' : '#FFFFFF'
      }
    }

    // Handle video play from video preview
    const handlePlay = (firstPlay: () => void):void => {
      firstPlay()
      showPreview.value = false
    }

    onMounted(async () => {
      changeViewOverlayStatus()
      await getWelcomeVideo()
    })

    return {
      viewOverlay,
      loadingVideo,
      showPreview,
      onPlayerReady,
      handlePlay,
      playerEvents,
      getWelcomeVideo,
      handleFullscreenChange
    }
  }
})

</script>

<style lang="scss" scoped>
.welcome-title {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 700;
  font-size: 54px;
  line-height: 80px;
  color: #68C453;
}

.welcome-content-card {
  width: 80%;
  height: 500px;
  border-radius: 16px;
}

.play-icon {
  width: 250px;
  height: 250px;
  transition: transform 250ms;
  filter: drop-shadow(0px 3.62243px 10.8673px rgba(0, 0, 0, 0.15));

  @media screen and (max-width: $breakpoint-xs) {
    width: 50%;
    height: 50%;
  }
}

.watercolor-background {
  background-image: url("~@/assets/png/play-learn/acuarela-yellow.png"),
    url("~@/assets/png/play-learn/acuarela-green.png");
  background-size: auto,
    400px 400px;
  background-position: -40% 15%,
    100% 0%;
}

.welcome-inline-player {
  @media screen and (max-width: 1263px) and (orientation: portrait) {
    aspect-ratio: 16/9;
  }

  @media screen and (max-width: 1263px) and (orientation: landscape) {
    aspect-ratio: 2.36;
  }
}

.player-preview-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(0deg, #000000 -20.15%, rgba(77, 77, 77, 0) 73.48%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  padding-top: 25px;
  cursor: pointer;
  transition: opacity 250ms ease-in-out;
  pointer-events: none;
  opacity: 0;

  &.player-preview-container-shown {
    opacity: 1;
    pointer-events: auto;
  }

  .player-preview-icon {
    width: 15%;
    aspect-ratio: 1;
    object-fit: contain;
    object-position: center center;
    transition: transform 250ms ease-in-out;

    &.player-preview-icon-scaled {
      transform: scale(1.15);
    }
  }
}
</style>
