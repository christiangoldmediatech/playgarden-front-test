<template>
  <v-overlay class="lesson-completed" :value="value" z-index="4000">
    <div class="lesson-completed-scroll d-flex flex-column align-center !pg-relative pg-overflow-y-auto pg-overflow-x-visible xl:pg-overflow-visible pg-max-h-screen pg-pb-16 pg-pt-5 lg:pg-pb-0 pg-max-w-[100vw]">
      <v-col class="!pg-relative" cols="12">
        <v-btn
          icon
          color="white"
          class="pg-bg-[#F6B7D2] !pg-absolute pg-top-[-10px] md:pg-top-0 pg-right-2 lg:pg-right-0 xl:pg-right-[-150px]"
          x-large
          @click="$emit('exit' )"
        >
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-col>

      <h2 class="overlay-title pg-text-[20px] md:pg-text-xl mb-2 pg-px-1 md:pg-px-0">
        Congratulations! <br />
        You've completed the {{ dayString }} day of video lessons!
      </h2>

      <div class="lesson-completed-container">
        <div class="lesson-completed-content">
          <v-row class="lesson-completed-content-row">
            <div class="lesson-completed-player">
              <PgVideoPlayer
                inline
                force-default-poster
                :control-config="{
                  favorite: false,
                  prevTrack: false,
                  nextTrack: false
                }"
                @ready="onPlayerReady"
              />
            </div>
          </v-row>
        </div>
      </div>

      <div class="pg-mt-14 pg-mb-3 pg-flex pg-flex-col md:pg-flex-row pg-items-baseline pg-justify-center pg-gap-10">
        <v-card class="!pg-relative !pg-m-0 !pg-mb-5 !pg-p-0 !pg-rounded-xl" max-width="200" light @click="goToWorksheets">
          <img src="@/assets/png/dashboard/end-lesson/online_worksheets.png" class="pg-w-full pg-max-h-[240px] pg-object-cover pg-mt-[-10px] !pg-rounded-2xl" />
          <img src="@/assets/png/dashboard/end-lesson/number_1.png" class="pg-absolute pg-top-[-25px] pg-left-[-10px] pg-w-14" />
          <div class="pg-font-bold pg-text-center pg-text-lg pg-text-[#F89838] pg-py-3">
            Online Worksheets
          </div>
        </v-card>
        <v-card class="!pg-relative !pg-m-0 !pg-mb-5 !pg-p-0 !pg-rounded-xl" max-width="200" light @click="goToOfflineWorksheets">
          <img src="@/assets/png/dashboard/end-lesson/print_worksheets.png" class="pg-w-full pg-max-h-[240px] pg-object-cover pg-mt-[-10px] !pg-rounded-2xl" />
          <img src="@/assets/png/dashboard/end-lesson/number_2.png" class="pg-absolute pg-top-[-25px] pg-left-[-10px] pg-w-14" />
          <div class="pg-font-bold pg-text-center pg-text-lg pg-text-[#F89838] pg-py-3">
            Print Worksheets
          </div>
        </v-card>
        <v-card class="!pg-relative !pg-m-0 !pg-mb-5 !pg-p-0 !pg-rounded-xl" max-width="200" light @click="skipToActivities">
          <img src="@/assets/png/dashboard/end-lesson/activities.png" class="pg-w-full pg-max-h-[240px] pg-object-cover pg-mt-[-10px] !pg-rounded-2xl" />
          <img src="@/assets/png/dashboard/end-lesson/number_3.png" class="pg-absolute pg-top-[-25px] pg-left-[-10px] pg-w-14" />
          <div class="pg-font-bold pg-text-center pg-text-lg pg-text-[#F89838] pg-py-3">
            Activities
          </div>
        </v-card>
      </div>

      <div class="lesson-completed-options">
        <v-btn
          class="dashboard-message-btn"
          color="primary"
          text
          block
          tile
          @click.stop="$emit('return')"
        >
          <v-icon class="pg-mr-2">
            mdi-chevron-left
          </v-icon>
          Return to lesson
        </v-btn>
      </div>

      <v-btn
        class="!pg-underline-offset-1 pg-mb-3"
        color="white"
        text
        tile
        @click.stop="$emit('exit', false)"
      >
        Skip for now
      </v-btn>
      <div class="pg-w-full md:pg-w-8/12 pg-text-center pg-font-light pg-font-quick">
        Remember that in order to continue to the next lesson, you must complete the online worksheets, video activities and worksheets of this lesson.
      </div>
    </div>
  </v-overlay>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  useStore,
  useRoute,
  useRouter,
  watch
} from '@nuxtjs/composition-api'
import {
  useAppEventBusHelper,
  useDashboardLink,
  useIsLessonCompleted,
  useNuxtHelper
} from '@/composables'
// @ts-ignore
import PgVideoPlayer from '@gold-media-tech/pg-video-player'

import { APP_EVENTS, TypedStore } from '@/models'
import { PlayerInstance } from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'

const playlist: MediaObject[] = [
  {
    title: '',
    src: {
      url:
        'https://d3dnpqxalhovr4.cloudfront.net/out/v1/24b478a52d0f4d8ea11bdd0a2bb43c59/748ec5dbba9f4aa0a2eef8a74fb2c043/68b7491c440d41d4b8b6fb0ae08fe0b4/index.m3u8',
      type: 'application/x-mpegURL'
    }
  }
]

export default defineComponent({
  name: 'LessonCompletedDialog',

  components: {
    PgVideoPlayer
  },

  props: {
    value: {
      type: Boolean,
      required: true
    }
  },

  emits: ['exit', 'return'],

  setup(props, { emit }) {
    const store = useStore<TypedStore>()
    const route = useRoute()
    const router = useRouter()
    const nuxt = useNuxtHelper()
    const appEventBus = useAppEventBusHelper()

    let player: PlayerInstance

    const getLesson = computed(() => {
      return store.getters['admin/curriculum/getLesson']
    })

    const dayString = computed(() => {
      const days = ['first', 'second', 'third', 'fourth', 'fifth']
      return days[getLesson.value.day - 1]
    })

    const { generateDashboardRoute } = useDashboardLink({
      route,
      lesson: getLesson
    })

    watch(
      () => props.value,
      () => {
        if (props.value) {
          waitAndPlay()
        } else {
          player.pause()
          emit('close')
        }
      }
    )

    function play() {
      player.setCurrentTime(0)
      player.setStatus('IDLE')
      player.play()
    }

    function createWaiter() {
      const waiter = window.setInterval(() => {
        if (player) {
          play()
          window.clearInterval(waiter)
        }
      }, 50)
    }

    function waitAndPlay() {
      if (player) {
        play()
      } else {
        createWaiter()
      }
    }

    function onPlayerReady(playerInstance: PlayerInstance) {
      player = playerInstance
      player.loadPlaylist(playlist)
    }

    const { isLessonCompleted } = useIsLessonCompleted()
    function goToWorksheets() {
      isLessonCompleted.value = false
      appEventBus.$emit(APP_EVENTS.DASHBOARD_ONLINE_WORKSHEET_CLICKED)
      router.push(generateDashboardRoute('online-worksheet'))
    }

    const goToOfflineWorksheets = () => {
      router.push(generateDashboardRoute('offline-worksheet'))
    }

    function skipToActivities() {
      // Find first activity
      const activities = getLesson.value.lessonsActivities.map(
        ({ id, activity }: any) => ({ id, activity })
      )

      const validActivities = activities.filter(({ activity }: any) => {
        return activity.videos?.videoUrl
      })

      if (!validActivities.length) {
        return
      }

      const playlist: MediaObject[] = validActivities.map(
        ({ id, activity }: any) => {
          return {
            title: activity.activityType.name,
            description: activity.videos.description,
            poster: activity.videos.image,
            src: {
              url: activity.videos.videoUrl.HLS,
              type: 'application/x-mpegURL'
            },
            meta: {
              videoId: activity.videos.id,
              author: `with ${activity.videos.name}`,
              videoType: 'LESSON ACTIVITIES',
              videoIcon: activity.activityType.icon,
              activityType: activity.activityType,
              curriculumType: activity.curriculumType,
              lessonActivityId: id,
              activityId: activity.id,
              viewed: activity.viewed
            }
          }
        }
      )

      nuxt.$emit('open-lesson-activity-player', { playlist, index: 0 })
      isLessonCompleted.value = false
      router.push(
        generateDashboardRoute('lesson-activities', { id: activities[0].id })
      )
    }

    return {
      onPlayerReady,
      goToWorksheets,
      skipToActivities,
      goToOfflineWorksheets,
      dayString
    }
  }
})
</script>

<style lang="scss" scoped>
.overlay-title {
  font-family: 'Quicksand', sans-serif;
  font-style: normal;
  font-weight: 700;
  text-align: center;
  margin: 0;
}

.overlay-title {
  color: #f89838;
}

.lesson-completed {
  &-scroll {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
    &::-webkit-scrollbar{
      display: none;
    }
  }
  &.v-overlay__content {
    width: 100vw;
    min-height: 100vh;
    padding: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &-container {
    width: 100%;
    max-height: 100%;
    max-width: 660px;
    padding-top: 29px;
    margin: 0 auto;
  }

  &-content {
    height: 100%;

    &-row {
      margin: 0;
      @media screen and (max-width: 1264px) and (orientation: landscape) {
        flex-wrap: nowrap;
      }
    }
  }

  &-player {
    overflow-x: hidden;
    width: 100%;
    aspect-ratio: 16 / 9;
  }
}
</style>
