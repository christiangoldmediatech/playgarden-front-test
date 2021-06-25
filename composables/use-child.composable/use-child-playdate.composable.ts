import { axios } from '@/utils'
import { useSnotifyHelper } from '@/composables'
import { Child, Playdates } from '@/models'

export const useChildPlayDates = () => {
  const snotify = useSnotifyHelper()

  const getChildrenInfo = (
    params: unknown
  ): Promise<{ children: Child; playdates: Playdates[] }> | void => {
    try {
      return axios.$get('/playdates/children/', { params })
    } catch (error) {
      snotify.error('Sorry! There was an error while getting info.')
    }
  }

  const getPlaydateInvite = (id: number) => {
    return axios.$get(`/playdates/invite/${id}`)
  }

  const removeChildrenPlaydates = (id: number) => {
    return axios.$delete(`/playdates/${id}/invite/children/${id}`)
  }

  const deletePlaydatesInvitation = (id: number) => {
    return axios.$delete(`/playdates/invite/${id}`)
  }

  return {
    getChildrenInfo,
    getPlaydateInvite,
    removeChildrenPlaydates,
    deletePlaydatesInvitation
  }
}
