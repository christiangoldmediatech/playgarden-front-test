/* eslint-disable no-console */
import { axios } from '@/utils'
import { ComputedRef } from '@nuxtjs/composition-api'

type VideoAnalyticStatus = 'STARTED' | 'PAUSED' | 'RESUMED' | 'SKIPPED' | 'COMPLETED' | 'CLOSED'

type VideoAnalytic = {
  videoId: number
  time: number
  status: VideoAnalyticStatus
}

export const useVideoAnalytics = ({ child }: { child: ComputedRef<any> }) => {
  const sendVideoAnalytics = async (
    { videoId, time, status }: VideoAnalytic
  ): Promise<any> => {
    try {
      const data = await axios.$post(
        `/videos/${videoId}/children/${child.value.id}/${status}`,
        { time }
      )
      return data
    } catch (error) {
      console.error(error)
    }
  }

  return {
    sendVideoAnalytics
  }
}
