<template>
  <v-main class="watercolor-background">
    <v-row no-gutters class="fill-height pt-16">
      <v-col cols="12">
        <days-selector-overlay v-model="viewDaySelectorOverlay" />
        <welcome-overlay v-model="viewOverlay" />
        <lesson-end-overlay
          v-if="!loadingVideo"
          :value.sync="endLessonOverlay"
          :worksheet-url="worksheetUrl"
        />
        <v-row no-gutters>
          <v-col cols="12">
            <v-row no-gutters justify="center" class="mb-6">
              <h1 class="welcome-title">
                {{ pageTitle }}
              </h1>
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
  onUnmounted
} from '@nuxtjs/composition-api'
import WelcomeOverlay from '@/components/app/WelcomeOverlay.vue'
// @ts-ignore
import PgVideoPlayer from '@gold-media-tech/pg-video-player'
import { PlayerInstance } from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'
import LessonEndOverlay from '@/components/app/LessonEndOverlay.vue'
import { TypedStore } from '@/models'
import { useRegisterFlow } from '@/composables/use-register-flow.composable'
import DaysSelectorOverlay from '@/components/app/DaysSelectorOverlay.vue'
import { StepIntroductionVideoEnum } from '../../enums/step-introduction-video.enum'

export default defineComponent({
  name: 'Welcome',
  components: {
    LessonEndOverlay,
    WelcomeOverlay,
    PgVideoPlayer,
    DaysSelectorOverlay
  },
  setup() {
    const store = useStore<TypedStore>()
    const isFullscreen = ref(false)
    const showPreview = ref(true)
    const player = ref<PlayerInstance | null>(null)
    const {
      viewOverlay,
      viewDaySelectorOverlay,
      loadingVideo,
      videoPlaylist,
      changeViewOverlayStatus,
      playerEvents,
      getWelcomeVideo,
      endLessonOverlay,
      getVideoByName,
      lesson
    } = useRegisterFlow()

    const stepIntroductionVideo = computed(() => getUserInfo.value.stepIntroductionVideo as StepIntroductionVideoEnum)

    const pageTitle = computed(() => {
      if (stepIntroductionVideo.value === StepIntroductionVideoEnum.FIRST) {
        return 'Welcome to Playgarden Online!'
      } else if (stepIntroductionVideo.value === StepIntroductionVideoEnum.SECOND) {
        return 'Hi, welcome back to Playgarden and your second day of learning'
      } else {
        return 'Hi, welcome back to Playgarden and your third day of learning'
      }
    })

    const getUserInfo = computed(() => {
      return store.getters['auth/getUserInfo']
    })

    const showOverlays = computed(() => stepIntroductionVideo.value === StepIntroductionVideoEnum.FIRST)

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

    const onPlayerReady = (playerInstance: PlayerInstance) => {
      player.value = playerInstance
      player.value.loadPlaylist(videoPlaylist.value)
      handlePlay(() => {
        player.value?.play()
      })
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
        lessonId: lesson.value.id
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
      if (!viewDaySelectorOverlay.value && showOverlays.value) {
        changeViewOverlayStatus()
      }
    })

    onMounted(async () => {
      if (showOverlays.value) {
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
      viewDaySelectorOverlay,
      endLessonOverlay,
      loadingVideo,
      showPreview,
      onPlayerReady,
      handlePlay,
      playerEvents,
      getWelcomeVideo,
      handleFullscreenChange,
      worksheetUrl,
      pageTitle
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
  font-size: 54px;
  line-height: 80px;
  color: #68c453;
  text-align: center;
}
</style>
