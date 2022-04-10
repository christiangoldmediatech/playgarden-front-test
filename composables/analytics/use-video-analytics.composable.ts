/* eslint-disable no-console */
import { axios } from '@/utils'
import { PlayerInstanceEvent } from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'
import { ComputedRef } from '@nuxtjs/composition-api'

type VideoAnalyticStatus = 'STARTED' | 'PAUSED' | 'RESUMED' | 'SKIPPED' | 'COMPLETED' | 'CLOSED'

type VideoAnalytic = {
  childId: number
  videoId: number
  time: number
  status: VideoAnalyticStatus
}

type PlayerEvenVideoAnalytic = {
  children: ComputedRef<any[] | undefined>
  event: PlayerInstanceEvent
  status: VideoAnalyticStatus
}

export const useVideoAnalytics = () => {
  async function sendVideoAnalytics(
    { childId, videoId, time, status }: VideoAnalytic
  ): Promise<any> {
    try {
      const data = await axios.$post(
        `/videos/${videoId}/children/${childId}/${status}`,
        { time }
      )
      return data
    } catch (error) {
      console.error(error)
    }
  }

  function sendPlayerEventVideoAnalytics({ children, event, status }: PlayerEvenVideoAnalytic) {
    if (children.value && children.value.length) {
      children.value.forEach((child) => {
        if (child && child.id) {
          sendVideoAnalytics({
            childId: child.id,
            status,
            time: event.currentTime,
            videoId: event.currentTrack?.meta?.videoId ?? 0
          })
        }
      })
    }
  }

  return {
    sendVideoAnalytics,
    sendPlayerEventVideoAnalytics
  }
}
