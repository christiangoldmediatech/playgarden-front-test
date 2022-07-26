import { ref, computed, useRoute, useRouter } from '@nuxtjs/composition-api'
import { Store } from 'vuex/types/index'
import { TypedStore } from '@/models'
import {
  PlayerInstance,
  PlayerInstanceEvent,
  PLAYER_EVENTS
} from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'
import { axios } from '@/utils'
import { useChild, useDashboardLink, useNuxtHelper, useVideoAnalytics } from '@/composables'

const isLessonActivitiesFinished = ref(false)
export const useIsLessonActivitiesFinished = () => {
  return {
    isLessonActivitiesFinished
  }
}

type LessonActivityPlayerCallbacksParams = {
  store: Store<TypedStore>
  route: ReturnType<typeof useRoute>
  router: ReturnType<typeof useRouter>
  nuxt: ReturnType<typeof useNuxtHelper>
  playerInstance: PlayerInstance
}

type SaveActivityProgressPayload = {
  id: number // videoId
  completed: boolean
  time: number
  date: string
}

export const useLessonActivitiesPlayerCallbacks = (
  params: LessonActivityPlayerCallbacksParams
) => {
  const { store, route, router, nuxt, playerInstance } = params
  const lesson = computed(() => {
    return store.getters['admin/curriculum/getLesson']
  })
  const { currentChildren } = useChild({ store })

  // Dashboard link generator
  const { generateDashboardRoute } = useDashboardLink({ route, lesson })

  // Get needed analytic functions
  const { sendPlayerEventVideoAnalytics } = useVideoAnalytics()

  let isSavingActivityProgess = false

  function determineSaveActivityProgressPayload(
    event: PlayerInstanceEvent,
    completeOverride = false
  ): SaveActivityProgressPayload {
    const remaining = event.duration - event.currentTime
    return {
      id: event.currentTrack?.meta?.activityId || 0,
      completed: event.duration === 0 && event.currentTime === 0 ? false : completeOverride || remaining <= 30,
      time: event.currentTime,
      date: new Date().toISOString().substring(0, 19)
    }
  }

  async function saveActivityProgress(
    event: PlayerInstanceEvent,
    completeOverride = false
  ) {
    try {
      if (!currentChildren.value || !lesson.value || !lesson.value.id || lesson.value.previewMode || isSavingActivityProgess) {
        return
      }

      isSavingActivityProgess = true
      const promises: Promise<any>[] = []
      const activity = determineSaveActivityProgressPayload(event, completeOverride)

      if (activity.id === 0 || !lesson.value || !currentChildren.value) {
        return
      }

      currentChildren.value.forEach((child) => {
        if (child && child.id) {
          promises.push(
            axios.$post(`/lessons/${lesson.value.id}/children/${child.id}/activity`, {
              activity
            })
          )
        }
      })
      await Promise.allSettled(promises)
    } catch (error) {
      return Promise.reject(error)
    } finally {
      nuxt.$emit('dashboard-panel-update')
      isSavingActivityProgess = false
    }
  }

  const playerEvents = {
    // When player is closed
    [PLAYER_EVENTS.ON_CLOSE]: (event: PlayerInstanceEvent): void => {
      sendPlayerEventVideoAnalytics({
        children: currentChildren,
        event,
        status: 'CLOSED'
      })
      saveActivityProgress(event)
    },

    // Whenever we play or resume a video
    [PLAYER_EVENTS.ON_PLAY]: (event: PlayerInstanceEvent): void => {
      sendPlayerEventVideoAnalytics({
        children: currentChildren,
        event,
        status: event.currentTime > 1 ? 'RESUMED' : 'STARTED'
      })
      saveActivityProgress(event)
    },

    // Whenever we pause a video
    [PLAYER_EVENTS.ON_PAUSE]: (event: PlayerInstanceEvent): void => {
      sendPlayerEventVideoAnalytics({
        children: currentChildren,
        event,
        status: 'PAUSED'
      })
      saveActivityProgress(event)
    },

    // Whenever a video ends
    [PLAYER_EVENTS.ON_ENDED]: (event: PlayerInstanceEvent): void => {
      sendPlayerEventVideoAnalytics({
        children: currentChildren,
        event,
        status: 'COMPLETED'
      })
      saveActivityProgress(event)
      if (event.nextTrack) {
        playerInstance.goToNextTrack()
        const route = generateDashboardRoute('lesson-activities', { id: event.nextTrack.meta?.activityId })
        router.push(route)
      } else {
        isLessonActivitiesFinished.value = true
        const route = generateDashboardRoute('lesson-completed')
        router.push(route)
      }
    },

    // Whenever the user skips a video
    [PLAYER_EVENTS.ON_SKIP]: (event: PlayerInstanceEvent): void => {
      sendPlayerEventVideoAnalytics({
        children: currentChildren,
        event,
        status: 'SKIPPED'
      })
      saveActivityProgress(event, true)
      if (event.nextTrack) {
        const route = generateDashboardRoute('lesson-activities', { id: event.nextTrack.meta?.activityId })
        router.push(route)
        playerInstance.goToNextTrack()
      } else {
        playerInstance.seek(event.duration)
      }
    },

    [PLAYER_EVENTS.ON_SKIP_BACK]: (): void => {
      const index = playerInstance.getCurrentIndex()
      if (index > 0) {
        const previousTrack = playerInstance.getPlaylist()[index - 1]
        const route = generateDashboardRoute('lesson-activities', { id: previousTrack.meta?.activityId })
        router.push(route)
      }
      playerInstance.goToPrevTrack()
    },

    // 30 seconds before a video ends (fires once per track)
    [PLAYER_EVENTS.ON_UNDER_30]: async (
      event: PlayerInstanceEvent
    ): Promise<void> => {
      await saveActivityProgress(event)
      playerInstance.popUnlock()
    }
  }

  return {
    playerEvents
  }
}
