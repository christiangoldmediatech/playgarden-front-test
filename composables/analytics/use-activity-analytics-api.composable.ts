import { axios } from '@/utils'

interface AnalyticPatch {
  entityId: number
  entityType: string
  didFinish: boolean
  time: number
}

interface AnalyticConfig extends AnalyticPatch {
  childrenId: number
}

export const useActivityAnalyticsApi = () => {
  const createActivityAnalytic = async (params: AnalyticConfig) => {
    try {
      const data = await axios.$post('/activities-analytics', params)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const getActivityAnalytic = async (activityId: number, childId: number) => {
    try {
      const data = await axios.$get(
        `/activities-analytics/video/${activityId}/children/${childId}`
      )
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const updateActivityAnalytic = async (
    analyticsId: number,
    params: AnalyticPatch
  ) => {
    try {
      const data = await axios.$patch(
        `/activities-analytics/${analyticsId}`,
        params
      )
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return {
    createActivityAnalytic,
    getActivityAnalytic,
    updateActivityAnalytic
  }
}
