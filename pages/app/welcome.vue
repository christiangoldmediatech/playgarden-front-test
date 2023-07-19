<template>
  <v-main class="watercolor-background">
    <v-row no-gutters class="fill-height sm:pg-pt-16 pg-pt-10">
      <v-col cols="12">
        <days-selector-overlay v-model="viewDaySelectorOverlay" />
        <welcome-overlay v-model="viewOverlay" />
        <lesson-end-overlay
          v-if="lesson"
          :value.sync="endLessonOverlay"
          :lesson="lesson"
        />
        <v-row no-gutters>
          <v-col cols="12">
            <v-row no-gutters justify="center" class="mb-6">
              <h2 class="welcome-title pg-text-xl md:pg-text-3xl lg:pg-text-5xl">
                {{ pageTitle }}
              </h2>
            </v-row>

            <v-row justify="center">
              <v-card
                class="d-flex flex-column player-content-card elevation-0"
              >
                <pg-loading :loading="loadingVideo">
                  <pg-video-player
                    class="inline-player"
                    inline
                    :control-config="{
                      prevTrack: false,
                      nextTrack: false,
                      favorite: false
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
                            :class="[
                              'play-icon no-background',
                              { 'scaled-play-icon': hover }
                            ]"
                            src="@/assets/svg/simple-play.svg"
                            width="100%"
                          />
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
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  watch,
  useStore,
  onUnmounted,
  useRoute
} from '@nuxtjs/composition-api'
import WelcomeOverlay from '@/components/app/WelcomeOverlay.vue'
import LessonEndOverlay from '@/components/app/LessonEndOverlay.vue'
// @ts-ignore
import PgVideoPlayer from '@gold-media-tech/pg-video-player'
import { PlayerInstance } from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'
import { TypedStore } from '@/models'
import { useRegisterFlow } from '@/composables/use-register-flow.composable'
import DaysSelectorOverlay from '@/components/app/DaysSelectorOverlay.vue'
import { useLanguageHelper } from '@/composables'

export default defineComponent({
  name: 'Welcome',
  components: {
    WelcomeOverlay,
    PgVideoPlayer,
    LessonEndOverlay,
    DaysSelectorOverlay
  },
  setup() {
    const store = useStore<TypedStore>()
    const isFullscreen = ref(false)
    const showPreview = ref(true)
    const route = useRoute()
    const player = ref<PlayerInstance | null>(null)
    const language = useLanguageHelper()
    const stepIntroductionVideo = computed(() => {
      return Number(route.value.query?.step || 1)
    })
    const {
      viewOverlay,
      viewDaySelectorOverlay,
      loadingVideo,
      videoPlaylist,
      endLessonOverlay,
      changeViewOverlayStatus,
      playerEvents,
      getWelcomeVideo,
      getVideoByName,
      lesson
    } = useRegisterFlow(stepIntroductionVideo.value)

    const pageTitle = computed(() => {
      if (stepIntroductionVideo.value === 1) {
        return language.t('welcome.titleDay1')
      } else if (stepIntroductionVideo.value === 2) {
        return language.t('welcome.titleDay2')
      } else {
        return language.t('welcome.titleDay3')
      }
    })

    const isFirstDay = computed(() => stepIntroductionVideo.value === 1)

    const onPlayerReady = (playerInstance: PlayerInstance) => {
      player.value = playerInstance
      player.value.loadPlaylist(videoPlaylist.value)
      if (!isFirstDay.value) {
        handlePlay(() => {
          player.value?.play()
        })
      }
    }

    const handleFullscreenChange = (val: boolean): void => {
      isFullscreen.value = val
      const htmlElem = document.querySelector('html')
      if (htmlElem) {
        htmlElem.style.backgroundColor = val ? '#000000' : '#FFFFFF'
      }
    }

    // Handle video play from video preview
    const handlePlay = (firstPlay: () => void): void => {
      firstPlay()
      showPreview.value = false
    }

    const createWelcomeLesson = async () => {
      const children = store.getters.getCurrentChild
      await store.dispatch('children/lesson/createLessonById', {
        childId: children[0].id,
        lessonId: lesson.value.lesson.id
      })
    }

    watch(viewOverlay, () => {
      if (!viewOverlay.value && !loadingVideo.value) {
        handlePlay(() => {
          player.value?.play()
        })
      }
    })

    watch(viewDaySelectorOverlay, () => {
      if (!viewDaySelectorOverlay.value && isFirstDay.value) {
        changeViewOverlayStatus()
      }
    })

    onMounted(async () => {
      if (isFirstDay.value) {
        endLessonOverlay.value = false
        viewDaySelectorOverlay.value = true
        await getWelcomeVideo().finally(() => {
          createWelcomeLesson()
        })
      } else {
        viewDaySelectorOverlay.value = false
        await getVideoByName()
      }
    })

    onUnmounted(() => {
      if (player.value) {
        player.value.replacePlaylist([])
      }
    })

    return {
      viewOverlay,
      endLessonOverlay,
      viewDaySelectorOverlay,
      loadingVideo,
      showPreview,
      onPlayerReady,
      handlePlay,
      playerEvents,
      getWelcomeVideo,
      handleFullscreenChange,
      pageTitle,
      lesson
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/register-flow.scss';

.welcome-title {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 700;
  color: #68c453;
  text-align: center;
}
</style>
