import { ref } from '@nuxtjs/composition-api'
import { ActivityType } from '@/models'
import { axios } from '@/utils'

const activities = ref<ActivityType[]>([])

const getActivitesType = async (params?: unknown) => {
  activities.value = await axios.$get('/activity-types', { params })
}

export const useActivity = () => {
  return {
    activities,
    getActivitesType
  }
}
