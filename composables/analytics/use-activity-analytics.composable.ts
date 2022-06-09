/* eslint-disable no-console */
import { ref, ComputedRef } from '@nuxtjs/composition-api'
import { jsonCopy } from '@/utils'
import { useActivityAnalyticsApi, usePatch } from '@/composables'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'

// TODO: MUST UPDATE THIS TYPE TO NEWER MEDIA OBJECT MODEL
type CurrentVideo = {
  [key: string]: any
  entityId: number
  type: string
}

type ActivityAnalyticPayload = {
  video: CurrentVideo
  time: number
  duration: number
}

type AnalyticOperationParams = {
  currentVideo: CurrentVideo
  time: number
  didFinish: boolean
  startCheck: boolean
}

const activityAnalyticsLoading = ref<boolean>(false)

function determineCurrentVideo(mediaObject?: MediaObject): CurrentVideo {
  const currentVideo = {
    entityId: 0,
    type: 'Videos'
  }

  if (mediaObject) {
    currentVideo.entityId =
      (mediaObject.meta?.activityId || mediaObject.meta?.videoId) ?? 0
    currentVideo.type =
      mediaObject.meta?.type ||
      (mediaObject.meta?.activityId ? 'Activities' : 'Videos')
  }
  return currentVideo
}

export const useActivityAnalytics = (
  children: ComputedRef<any[] | undefined>
) => {
  const {
    createActivityAnalytic,
    getActivityAnalytic,
    updateActivityAnalytic
  } = useActivityAnalyticsApi()

  const { patchData, patchEarned, patchImg, toUnlock } = usePatch()

  const activityAnalyticOperation = async (
    child: any,
    params: AnalyticOperationParams
  ): Promise<any> => {
    try {
      // Destructure paremeters
      const { currentVideo, time, didFinish, startCheck } = params

      // Check if analytics already exists
      let analytic = await getActivityAnalytic(currentVideo.entityId, child.id)

      // If analytic exists, use same entity type on current video
      if (typeof analytic !== 'string' || Object.keys(analytic).length > 0) {
        currentVideo.type = analytic.entityType
      }

      if (typeof analytic === 'string' || Object.keys(analytic).length === 0) {
        // Analytic does not exist, create a new one
        const analyticPaylod = {
          childrenId: child.id,
          entityId: currentVideo.entityId,
          entityType: currentVideo.type,
          didFinish,
          time
        }

        analytic = await createActivityAnalytic(analyticPaylod)
      } else if (!startCheck) {
        let analyticTime: number | null = null
        if (analytic.time) {
          const a = analytic.time.split(':')
          analyticTime = +a[0] * 60 * 60 + +a[1] * 60 + +a[2]
        }
        if (analyticTime === null || time > analyticTime) {
          const params = {
            didFinish,
            time,
            entityId: currentVideo.entityId,
            entityType: currentVideo.type
          }
          analytic = await updateActivityAnalytic(analytic.id, params)
        } else {
          analytic = false
        }
      } else {
        analytic = false
      }

      // If we stil have an analytic operation to continue
      if (analytic) {
        if (!startCheck && analytic.patch && patchEarned.value === false) {
          const { activityType, number, image } = analytic.patch
          patchData.value = {
            number,
            category: activityType.name,
            icon: image
          }
          patchEarned.value = true
        }

        // Get patchImg and toUnlock
        patchImg.value = analytic.patchImg || ''
        toUnlock.value = analytic.toUnlock || null
      }

      return analytic
    } catch (error) {
      console.error(error)
    }
  }

  const sendActivityAnalytics = async (
    payload: ActivityAnalyticPayload,
    startCheck: boolean = false,
    overrideComplete: boolean = false
  ): Promise<any> => {
    try {
      // Constants
      const promises = [] as Promise<any>[]
      const params: AnalyticOperationParams = {
        currentVideo: jsonCopy(payload.video),
        time: payload.time,
        didFinish: payload.duration - payload.time <= 30 || overrideComplete,
        startCheck
      }

      // Skip if loading
      if (activityAnalyticsLoading.value || !children.value) {
        return false
      }

      // Set loading
      activityAnalyticsLoading.value = true

      // Do an operation for each current child in parallel
      // RECOMMENDATION: Create an end point specifically for when everyone is watching, to avoid long response times.
      children.value.forEach((child: any) => {
        const promise = activityAnalyticOperation(child, params)
        promises.push(promise)
      })

      // Do all promises
      await Promise.all(promises)
    } catch (error) {
      console.error(error)
    } finally {
      activityAnalyticsLoading.value = false
    }
  }

  return {
    activityAnalyticsLoading,
    sendActivityAnalytics,
    patchEarned,
    determineCurrentVideo
  }
}
