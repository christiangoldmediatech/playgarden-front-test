import { ComputedRef } from '@nuxtjs/composition-api'
import { PlayerInstance, PlayerInstanceEvent, PLAYER_EVENTS } from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'
import { useVideoAnalytics } from '@/composables'

type DashboardTeacherVideoCallbacksParams = {
  children: ComputedRef<any[] | undefined>,
  playerInstance: PlayerInstance,
  saveProgress: () => any
}

export function useDashboardTeacherVideoCallbacks({ children, playerInstance, saveProgress }: DashboardTeacherVideoCallbacksParams) {
  // Get needed analytic functions
  const { sendPlayerEventVideoAnalytics } = useVideoAnalytics()

  const playerEvents = {
    // When player is closed
    [PLAYER_EVENTS.ON_CLOSE]: (event: PlayerInstanceEvent): void => {
      sendPlayerEventVideoAnalytics({
        children, event, status: 'CLOSED'
      })
      saveProgress()
    },

    // Whenever we play or resume a video
    [PLAYER_EVENTS.ON_PLAY]: (event: PlayerInstanceEvent): void => {
      sendPlayerEventVideoAnalytics({
        children, event, status: event.currentTime > 1 ? 'RESUMED' : 'STARTED'
      })
      saveProgress()
    },

    // Whenever we pause a video
    [PLAYER_EVENTS.ON_PAUSE]: (event: PlayerInstanceEvent): void => {
      sendPlayerEventVideoAnalytics({
        children, event, status: 'PAUSED'
      })
      saveProgress()
    },

    // Whenever a video ends
    [PLAYER_EVENTS.ON_ENDED]: (event: PlayerInstanceEvent): void => {
      sendPlayerEventVideoAnalytics({
        children, event, status: 'COMPLETED'
      })
      saveProgress()
      playerInstance.close()
    }
  }

  return {
    playerEvents
  }
}
