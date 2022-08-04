<template>
  <v-overlay class="lesson-completed" :value="value" :z-index="4000">
    <v-card class="lesson-completed-container" light>
      <div class="pos-absolute pos-top-0 pos-left-0 w-100">
        <div class="green-line-bigger green-line-1" />
        <div class="green-line-bigger green-line-2" />
      </div>

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
          <div class="lesson-completed-options">
            <div class="lesson-completed-title">
              What do you want to do next?
            </div>
            <v-row class="mx-0 my-0 my-lg-n3">
              <div class="lesson-completed-button">
                <v-btn
                  color="accent"
                  block
                  :small="$vuetify.breakpoint.mdAndDown"
                  :large="$vuetify.breakpoint.lgAndUp"
                  @click.stop="goToWorksheets"
                >
                  <v-icon class="lesson-completed-icon">
                    pg-icon-paper-pencil
                  </v-icon>
                  COMPLETE WORKSHEETS
                </v-btn>
              </div>

              <div class="lesson-completed-button">
                <v-btn
                  color="#FEC572"
                  dark
                  block
                  :small="$vuetify.breakpoint.mdAndDown"
                  :large="$vuetify.breakpoint.lgAndUp"
                  @click.stop="skipToActivities"
                >
                  <v-icon class="lesson-completed-icon">
                    pg-icon-play
                  </v-icon>
                  SKIP TO ACTIVITIES
                </v-btn>
              </div>

              <v-col class="pa-1" cols="12">
                <v-btn
                  class="dashboard-message-btn"
                  color="primary"
                  text
                  block
                  tile
                  :x-small="$vuetify.breakpoint.smAndDown"
                  @click.stop="$emit('input', false)"
                >
                  Return to lesson
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-row>
      </div>
    </v-card>
  </v-overlay>
</template>

<script lang="ts">
import { defineComponent, computed, useStore, useRoute, useRouter, watch } from '@nuxtjs/composition-api'
import { useAppEventBusHelper, useDashboardLink, useIsLessonCompleted, useNuxtHelper } from '@/composables'
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

    const { generateDashboardRoute } = useDashboardLink({ route, lesson: getLesson })

    watch(() => props.value, () => {
      if (props.value) {
        waitAndPlay()
      } else {
        player.pause()
        emit('close')
      }
    })

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

    function skipToActivities() {
      // Find first activity
      const activities = getLesson.value.lessonsActivities.map(
        ({ id, activity }: any) => ({ id, activity })
      )

      const validActivities = activities.filter(
        ({ activity }: any) => {
          return activity.videos?.videoUrl
        }
      )

      if (!validActivities.length) {
        return
      }

      const playlist: MediaObject[] = validActivities.map(({ id, activity }: any) => {
        return {
          title: activity.activityType.name,
          description: activity.videos.description,
          poster: activity.videos.thumbnail,
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
      })

      nuxt.$emit('open-lesson-activity-player', { playlist, index: 0 })
      isLessonCompleted.value = false
      router.push(generateDashboardRoute('lesson-activities', { id: activities[0].id }))
    }

    return {
      onPlayerReady,
      goToWorksheets,
      skipToActivities
    }
  }
})
</script>

<style lang="scss">
.lesson-completed {
  & .green-line-1 {
    height: 12px;
  }
  & .green-line-2 {
    height: 17px;
  }
  & .v-overlay__content {
    width: 100vw;
    height: 100vh;
    padding: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &-container {
    width: 100%;
    max-height: 100%;
    max-width: 960px;
    overflow-x: hidden;
    overflow-y: auto;
    padding-top: 29px;
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
  &-options {
    padding: 8px;
    width: 100%;
    @media screen and (max-width: 1264px) and (orientation: landscape) {
      display: flex;
      flex-direction: column;
      justify-content: center;
      & > div {
        flex-basis: initial;
        flex-grow: 0;
      }
    }
  }
  &-title {
    font-weight: 600;
    font-size: 13px;
    line-height: 1.5;
    text-align: center;
    @media screen and (min-width: 960px) {
      font-size: 24px;
    }
    @media screen and (min-width: 1264px) {
      font-size: 33px;
    }
  }
  &-button {
    width: 100%;
    padding: 4px;
    @media screen and (min-width: 600px) {
      width: 50%;
    }
    @media screen and (max-width: 1263px) and (orientation: landscape) {
      width: 100%;
    }
    @media screen and (min-width: 1264px) {
      padding: 12px;
    }
  }
  &-icon {
    font-size: 18px !important;
    line-height: 1;
    position: relative;
    right: 16px;
    @media screen and (min-width: 1264px) {
      font-size: 24px !important;
    }
  }
}
</style>
