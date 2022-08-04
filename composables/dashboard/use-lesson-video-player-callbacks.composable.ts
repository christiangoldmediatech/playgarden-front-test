import { ref, computed, useRoute, useRouter } from '@nuxtjs/composition-api'
import { Store } from 'vuex/types'
import { axios } from '@/utils'
import {
  PlayerInstance,
  PlayerInstanceEvent,
  PLAYER_EVENTS
} from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'
import { useVideoAnalytics, useDashboardLink, useChild, useNuxtHelper } from '@/composables'
import { TypedStore } from '@/models'

type SaveVideoProgressPayload = {
  id: number // videoId
  completed: boolean
  time: number
  date: string
}

type LessonVideoPlayerCallbacksParams = {
  store: Store<TypedStore>
  route: ReturnType<typeof useRoute>
  router: ReturnType<typeof useRouter>
  nuxt: ReturnType<typeof useNuxtHelper>
  playerInstance: PlayerInstance
}

const isLessonCompleted = ref(false)
export const useIsLessonCompleted = () => {
  return {
    isLessonCompleted
  }
}

export const useLessonVideoPlayerCallbacks = ({
  store,
  route,
  router,
  nuxt,
  playerInstance
}: LessonVideoPlayerCallbacksParams) => {
  const lesson = computed(() => {
    return store.getters['admin/curriculum/getLesson']
  })

  const { currentChildren } = useChild({ store })

  // Dashboard link generator
  const { generateDashboardRoute } = useDashboardLink({ route, lesson })

  // Get needed analytic functions
  const { sendPlayerEventVideoAnalytics } = useVideoAnalytics()

  function determineSaveVideoProgressPayload(
    event: PlayerInstanceEvent,
    completeOverride = false
  ): SaveVideoProgressPayload {
    const remaining = event.duration - event.currentTime
    return {
      id: event.currentTrack?.meta?.videoId || 0,
      completed: event.duration === 0 && event.currentTime === 0 ? false : completeOverride || remaining <= 30,
      time: event.currentTime,
      date: new Date().toISOString().substring(0, 19)
    }
  }

  let isSavingProgess = false
  async function saveVideoProgress(
    event: PlayerInstanceEvent,
    completeOverride = false
  ) {
    try {
      if (!currentChildren.value || !lesson.value || !lesson.value.id || isSavingProgess || lesson.value.previewMode) {
        return
      }

      isSavingProgess = true
      const promises: Promise<any>[] = []
      const video = determineSaveVideoProgressPayload(event, completeOverride)
      currentChildren.value.forEach((child) => {
        if (child && child.id) {
          promises.push(
            axios.$post(`/lessons/${lesson.value.id}/children/${child.id}/video`, {
              video
            })
          )
        }
      })
      await Promise.allSettled(promises)
    } catch (error) {
      return Promise.reject(error)
    } finally {
      nuxt.$emit('dashboard-panel-update')
      isSavingProgess = false
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
      saveVideoProgress(event)
    },

    // Whenever we play or resume a video
    [PLAYER_EVENTS.ON_PLAY]: (event: PlayerInstanceEvent): void => {
      sendPlayerEventVideoAnalytics({
        children: currentChildren,
        event,
        status: event.currentTime > 1 ? 'RESUMED' : 'STARTED'
      })
      saveVideoProgress(event)
    },

    // Whenever we pause a video
    [PLAYER_EVENTS.ON_PAUSE]: (event: PlayerInstanceEvent): void => {
      sendPlayerEventVideoAnalytics({
        children: currentChildren,
        event,
        status: 'PAUSED'
      })
      saveVideoProgress(event)
    },

    // Whenever a video ends
    [PLAYER_EVENTS.ON_ENDED]: (event: PlayerInstanceEvent): void => {
      sendPlayerEventVideoAnalytics({
        children: currentChildren,
        event,
        status: 'COMPLETED'
      })
      saveVideoProgress(event)
      if (event.nextTrack) {
        playerInstance.goToNextTrack()
        const route = generateDashboardRoute('lesson-videos', { id: event.nextTrack.meta?.videoId })
        router.push(route)
      } else {
        isLessonCompleted.value = true
      }
    },

    // Whenever the user skips a video
    [PLAYER_EVENTS.ON_SKIP]: (event: PlayerInstanceEvent): void => {
      sendPlayerEventVideoAnalytics({
        children: currentChildren,
        event,
        status: 'SKIPPED'
      })
      saveVideoProgress(event, true)
      if (event.nextTrack) {
        const route = generateDashboardRoute('lesson-videos', { id: event.nextTrack.meta?.videoId })
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
        const route = generateDashboardRoute('lesson-videos', { id: previousTrack.meta?.videoId })
        router.push(route)
      }
      playerInstance.goToPrevTrack()
    },

    // 30 seconds before a video ends (fires once per track)
    [PLAYER_EVENTS.ON_UNDER_30]: async (
      event: PlayerInstanceEvent
    ): Promise<void> => {
      await saveVideoProgress(event)
      playerInstance.popUnlock()
    }
  }

  return {
    playerEvents
  }
}
