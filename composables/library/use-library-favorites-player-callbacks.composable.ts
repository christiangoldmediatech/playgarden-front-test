import { ComputedRef } from '@nuxtjs/composition-api'
import { PlayerInstanceEvent, PLAYER_EVENTS } from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'
import { useVideoAnalytics } from '@/composables'

type InlinePlayerCallbacksParams = {
  children: ComputedRef<any[] | undefined>,
  afterOnEnded: (mediaObject?: MediaObject) => void
}

export function useLibraryFavoritesCallbacks({ children, afterOnEnded }: InlinePlayerCallbacksParams) {
  // Get needed analytic functions
  const { sendPlayerEventVideoAnalytics } = useVideoAnalytics()

  const playerEvents = {
    // When player is closed
    [PLAYER_EVENTS.ON_CLOSE]: (event: PlayerInstanceEvent): void => {
      sendPlayerEventVideoAnalytics({
        children, event, status: 'CLOSED'
      })
    },

    // Whenever we play or resume a video
    [PLAYER_EVENTS.ON_PLAY]: (event: PlayerInstanceEvent): void => {
      sendPlayerEventVideoAnalytics({
        children, event, status: event.currentTime > 1 ? 'RESUMED' : 'STARTED'
      })
    },

    // Whenever we pause a video
    [PLAYER_EVENTS.ON_PAUSE]: (event: PlayerInstanceEvent): void => {
      sendPlayerEventVideoAnalytics({
        children, event, status: 'PAUSED'
      })
    },

    // Whenever a video ends
    [PLAYER_EVENTS.ON_ENDED]: (event: PlayerInstanceEvent): void => {
      sendPlayerEventVideoAnalytics({
        children, event, status: 'COMPLETED'
      })

      afterOnEnded()
    },

    // Whenever the user skips a video
    [PLAYER_EVENTS.ON_SKIP]: (event: PlayerInstanceEvent): void => {
      sendPlayerEventVideoAnalytics({
        children, event, status: 'SKIPPED'
      })

      afterOnEnded()
    }
  }

  return {
    playerEvents
  }
}
