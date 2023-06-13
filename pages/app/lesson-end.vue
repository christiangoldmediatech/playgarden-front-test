<template>
  <v-main class="watercolor-background">
    <v-row no-gutters class="fill-height sm:pg-pt-16 pg-pt-10">
      <v-col cols="12">
        <lesson-end-overlay
          v-if="lesson"
          :value.sync="endLessonOverlay"
          :worksheet-url="worksheetUrl"
          :lesson="lesson"
        />
        <v-row no-gutters>
          <v-col cols="12">
            <v-row no-gutters justify="center" class="mb-6">
              <h1 class="lesson-end-title pg-text-xl md:pg-text-3xl lg:pg-text-5xl">
                We can't wait to see you tomorrow!
              </h1>
            </v-row>

            <v-row justify="center">
              <v-card class="d-flex flex-column player-content-card elevation-0">
                <pg-loading :loading="loadingVideo">
                  <pg-video-player
                    class="inline-player"
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

                <div class="email-info-wrapper d-flex" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
                  <div class="email-info-text py-2 px-14" :class="{ 'hide-text': hiddenInfoText }">
                    <p>
                      Want to receive an email with all of the things you did today? <br>
                      <nuxt-link :to="{ name: 'app-account-index-notification' }">
                        Click here to update your Email Notification Settings.
                      </nuxt-link>
                    </p>
                  </div>
                  <img src="@/assets/svg/email.svg" />
                </div>
              </v-card>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-main>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, onMounted, ref, useStore } from '@nuxtjs/composition-api'
// @ts-ignore
import PgVideoPlayer from '@gold-media-tech/pg-video-player'
import {
  PLAYER_EVENTS,
  PlayerInstance,
  PlayerInstanceEvent
} from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'
import LessonEndOverlay from '@/components/app/LessonEndOverlay.vue'
import { useRegisterFlow } from '@/composables/use-register-flow.composable'
import { TypedStore } from '@/models'

export default defineComponent({
  name: 'LessonEnd',
  components: {
    PgVideoPlayer,
    LessonEndOverlay
  },
  setup() {
    const {
      loadingVideo,
      lesson,
      endLessonOverlay,
      getClosingVideo,
      closingVideo
    } = useRegisterFlow()
    const store = useStore<TypedStore>()
    const isFullscreen = ref(false)
    const showPreview = ref(true)
    const viewOverlay = ref(true)
    const hiddenInfoText = ref(false)
    const player = ref<PlayerInstance | null>(null)

    const onPlayerReady = (playerInstance: PlayerInstance) => {
      player.value = playerInstance
      player.value.loadPlaylist(closingVideo.value)
      handlePlay(() => {
        player.value?.play()
      })
    }

    const worksheetUrl = computed(() => {
      return {
        name: 'app-dashboard-online-worksheet',
        query: {
          childId: store.getters.getCurrentChild[0].id,
          lessonId: lesson.value ? lesson.value.id : 0,
          worksheet: 0
        }
      }
    })

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

    const handleMouseEnter = () => {
      hiddenInfoText.value = false
    }

    const handleMouseLeave = () => {
      hiddenInfoText.value = true
    }

    onBeforeMount(() => {
      getClosingVideo()
    })

    onMounted(() => {
      endLessonOverlay.value = false
      setTimeout(() => {
        hiddenInfoText.value = true
      }, 4000)
    })

    const playerEvents = {
      // Whenever a video ends.
      [PLAYER_EVENTS.ON_ENDED]: (event: PlayerInstanceEvent) => {
        endLessonOverlay.value = true
      }
    }

    return {
      viewOverlay,
      lesson,
      hiddenInfoText,
      handleMouseEnter,
      handleMouseLeave,
      endLessonOverlay,
      showPreview,
      onPlayerReady,
      handlePlay,
      handleFullscreenChange,
      playerEvents,
      loadingVideo,
      worksheetUrl
    }
  }
})

</script>

<style lang="scss" scoped>
@import '~@/assets/scss/register-flow.scss';

.lesson-end-title {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 700;
  color: #96D5DE;
}

.email-info-wrapper {
  position: absolute;
  bottom: -30px;
  right: 0;
  z-index: 100;

  img {
    position: absolute;
    top: -30px;
    right: -100px;
    width: 160px;
  }
}

.email-info-text {
  position: relative;
  background: white;
  overflow: hidden;
  width: 450px;
  height: 96px;
  border-radius: 35px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
  transition: width 0.3s ease-in-out;

  p {
    font-family: 'Quicksand';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    color: #707070;
    margin: 0;
    transition: width 0.3s ease-in-out;
  }

  a {
    color: #F89838 !important;
    text-decoration: underline !important;
  }
}

.hide-text {
  width: 0 !important;
  padding: 0 !important;

  p {
    display: none;
  }
}
</style>
