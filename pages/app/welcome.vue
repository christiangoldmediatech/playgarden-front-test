<template>
  <v-main class="watercolor-background">
    <v-row no-gutters class="fill-height sm:pg-pt-16 pg-pt-10">
      <v-col cols="12">
        <PostQuestionnaireDialog v-model="showPostQuestionnaireDialog" />
        <welcome-overlay v-model="viewOverlay" />
        <lesson-end-overlay
          v-if="lesson"
          v-model="endLessonOverlay"
          :lesson="lesson"
          :step="stepIntroductionVideo"
        />
        <v-row no-gutters class="pb-16">
          <v-col cols="12">
            <v-row no-gutters justify="center" class="mb-6 !pg-relative">
              <h2
                class="pg-w-[60%] welcome-title pg-text-xl md:pg-text-3xl lg:pg-text-4xl"
              >
                {{ pageTitle }}
              </h2>

              <div class="btn-container-wrapper">
                <v-btn
                  color="transparent elevation-0"
                  class="btn-container"
                  @click="goHome()"
                >
                  <img src="@/assets/svg/goHome.svg" />
                </v-btn>
              </div>
            </v-row>

            <v-row justify="center pb-16">
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
  useStore,
  onUnmounted,
  useRoute,
  useRouter
} from '@nuxtjs/composition-api'
import WelcomeOverlay from '@/components/app/WelcomeOverlay.vue'
import LessonEndOverlay from '@/components/app/LessonEndOverlay.vue'
// @ts-ignore
import PgVideoPlayer from '@gold-media-tech/pg-video-player'
import { PlayerInstance } from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'
import { TypedStore } from '@/models'
import { useRegisterFlow } from '@/composables/use-register-flow.composable'
import { useLanguageHelper } from '@/composables'
import PostQuestionnaireDialog from '@/components/questionnaire/PostQuestionnaireDialog.vue'

export default defineComponent({
  name: 'Welcome',
  components: {
    WelcomeOverlay,
    PgVideoPlayer,
    LessonEndOverlay,
    PostQuestionnaireDialog
  },
  setup() {
    const isDialogOpen = ref(false)
    const isFromQuestionnaire = computed(() => route.value.query.fromQuestionnaire === 'true')
    const showPostQuestionnaireDialog = computed({
      get() {
        return isDialogOpen.value
      },
      set(val: boolean) {
        isDialogOpen.value = val
        if (!val) {
          handlePlay(() => {
            player.value?.play()
          })
        }
      }
    })

    const store = useStore<TypedStore>()
    const isFullscreen = ref(false)
    const showPreview = ref(true)
    const route = useRoute()
    const router = useRouter()
    const player = ref<PlayerInstance | null>(null)
    const language = useLanguageHelper()
    const stepIntroductionVideo = computed(() => {
      return Number(route.value.query?.step || 1)
    })
    const {
      viewOverlay,
      loadingVideo,
      videoPlaylist,
      endLessonOverlay,
      playerEvents,
      getWelcomeVideo,
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

    const goHome = () => {
      router.push({ name: 'app-virtual-preschool' })
    }

    onMounted(async () => {
      endLessonOverlay.value = false
      isDialogOpen.value = isFromQuestionnaire.value
      await getWelcomeVideo().finally(() => {
        createWelcomeLesson()
      })
    })

    onUnmounted(() => {
      if (player.value) {
        player.value.replacePlaylist([])
      }
    })

    return {
      viewOverlay,
      stepIntroductionVideo,
      endLessonOverlay,
      showPostQuestionnaireDialog,
      loadingVideo,
      showPreview,
      onPlayerReady,
      isFirstDay,
      handlePlay,
      playerEvents,
      getWelcomeVideo,
      handleFullscreenChange,
      pageTitle,
      lesson,
      goHome
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

.btn-container {
  img {
    width: 70px;
  }

  @media screen and (min-width: 1025px) {
    img {
      width: 100px;
    }
  }
}

.btn-container-wrapper {
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;

  @media screen and (min-width: $breakpoint-xs) {
    margin-top: 0;
    width: unset;
    position: absolute;
    right: 10%;
    bottom: 0;
  }

  @media screen and (min-width: 1025px) {
    bottom: 10px;
  }
}

.btn-container::before {
  background-color: transparent !important;
}
</style>
