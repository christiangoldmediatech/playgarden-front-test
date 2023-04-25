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
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'
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
    const video = ref<MediaObject[]>([{
      title: 'cds',
      description: '',
      poster: 'https://playgarden-assets-dev.s3.amazonaws.com/images/activity-thumbnail/9c7f6f54-724c-40fd-be7c-c9f249c67c1b.png',
      src: {
        url: 'https://d2cj0am26xqmod.cloudfront.net/out/v1/cc87e0707d8d4c35ab769ba8944b7ece/4d64baf073cf4991b5fa1b5fb333e077/81176810af364bf2a58d60269e296f9e/index.m3u8',
        type: 'application/x-mpegURL'
      },
      meta: {
        videoId: 534,
        activityId: 204,
        activityType: {
          id: 3,
          name: 'Art',
          description: 'Create and imagine with our hands-on art projects and DIY area.',
          type: {
            extra: true,
            lesson: true,
            activity: true,
            kidsCorner: false
          },
          icon: 'https://img.playgardenonline.com/images/activity-type/39994559-b230-4173-a16a-2d1a0f55b522.svg',
          color: '#8DC63F',
          createdAt: '2020-08-03T02:06:25.661Z',
          updatedAt: '2022-02-08T17:09:16.000Z',
          deletedAt: null
        },
        curriculumType: {
          id: 15,
          name: 'Oo',
          description: 'Letter O',
          icon: 'https://img.playgardenonline.com/images/curriculum-type/3db3be7a-9d40-4d6a-8ba3-4e4c000ee6c2.svg',
          letter: 'Oo',
          picture: null,
          order: 16,
          createdAt: '2020-08-27T00:05:28.792Z',
          updatedAt: '2020-11-20T01:31:08.000Z',
          deletedAt: null
        },
        type: 'Activities',
        videoType: 'ACTIVITIES:',
        author: 'scsd',
        favorite: false
      }
    }])
    const { viewOverlay, changeViewOverlayStatus, playerEvents } = useRegisterFlow()

    const onPlayerReady = (playerInstance: PlayerInstance) => {
      player.value = playerInstance
      player.value.loadPlaylist(video.value)
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

    onMounted(() => {
      changeViewOverlayStatus()
    })

    return {
      viewOverlay,
      showPreview,
      onPlayerReady,
      handlePlay,
      playerEvents,
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
