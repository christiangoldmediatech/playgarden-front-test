import { ComputedRef } from '@nuxtjs/composition-api'
import { PlayerInstanceEvent, PLAYER_EVENTS } from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'
import { useVideoAnalytics, useActivityAnalytics } from '@/composables'

type InlinePlayerCallbacksParams = {
  children: ComputedRef<any[] | undefined>,
  afterOnEnded: (mediaObject?: MediaObject) => void
}

export function useLibraryStandardCallbacks({ children, afterOnEnded }: InlinePlayerCallbacksParams) {
  // Get needed analytic functions
  const { sendPlayerEventVideoAnalytics } = useVideoAnalytics()
  const { sendActivityAnalytics, determineCurrentVideo } = useActivityAnalytics(children)

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

      sendActivityAnalytics({
        duration: event.duration,
        time: event.currentTime,
        video: determineCurrentVideo(event.currentTrack)
      }, true)
    },

    // Whenever we pause a video
    [PLAYER_EVENTS.ON_PAUSE]: (event: PlayerInstanceEvent): void => {
      sendPlayerEventVideoAnalytics({
        children, event, status: 'PAUSED'
      })

      sendActivityAnalytics({
        duration: event.duration,
        time: event.currentTime,
        video: determineCurrentVideo(event.currentTrack)
      })
    },

    // Whenever a video ends
    [PLAYER_EVENTS.ON_ENDED]: async (event: PlayerInstanceEvent): Promise<void> => {
      sendPlayerEventVideoAnalytics({
        children, event, status: 'COMPLETED'
      })

      await sendActivityAnalytics({
        duration: event.duration,
        time: event.currentTime,
        video: determineCurrentVideo(event.currentTrack)
      }, false, true)

      afterOnEnded()
    },

    // Whenever the user skips a video
    [PLAYER_EVENTS.ON_SKIP]: (event: PlayerInstanceEvent): void => {
      sendPlayerEventVideoAnalytics({
        children, event, status: 'SKIPPED'
      })

      sendActivityAnalytics({
        duration: event.duration,
        time: event.currentTime,
        video: determineCurrentVideo(event.currentTrack)
      }, false, true)

      afterOnEnded()
    },

    // 30 seconds before a video ends (fires once per track)
    [PLAYER_EVENTS.ON_UNDER_30]: (event: PlayerInstanceEvent): void => {
      sendActivityAnalytics({
        duration: event.duration,
        time: event.currentTime,
        video: determineCurrentVideo(event.currentTrack)
      })
    }
  }

  return {
    playerEvents
  }
}
