import { Child, Playdate, Playdates, TypedStore } from '@/models'
import { axios } from '@/utils'
import { computed } from '@nuxtjs/composition-api'
import { Store } from 'vuex/types'

interface UseChildPlaydates {
  store: Store<TypedStore>
}

export const usePlaydates = ({ store }: UseChildPlaydates) => {
  const acceptInvitePlaydate = (token: string) => {
    return axios.$get(`/playdates/accept/invite/${token}`)
  }

  const addChildren = ({ id, data }: { id: number, data: unknown }) => {
    return axios.$post(`/playdates/${id}`, data)
  }

  const deletePlaydateInvitation = (token: string) => {
    return axios.$delete(`/playdates/invite/${token}`)
  }

  const getPlaydateInvite = (token: string) => {
    return axios.$get(`/playdates/invite/${token}`)
  }

  const getAndFilterPlaydates = (params: { showChildren?: boolean, day?: string }): Promise<Playdate[]> => {
    return axios.$get('/playdates', { params })
  }

  const getChildrenInfo = (): Promise<{ children: Child; playdates: Playdates[] }[]> => {
    return axios.$get('/playdates/children')
  }

  const getPlaydateDays = async (): Promise<{ days: string[] }> => {
    return await axios.$get('/playdates/days/available')
  }

  const joinPlaydate = ({ playdateId, childId }: { playdateId: number, childId: number }) => {
    return axios.$post(`/playdates/${playdateId}/add/children/${childId}`)
  }

  const deleteChildren = ({ playdateId, childId }: { playdateId: number, childId: number }) => {
    return axios.$delete(`/playdates/${playdateId}/remove/children/${childId}`)
  }

  /**
   * The playdates screen is only visible to paying users, users whose
   * stripe_status is 'active'
   * @returns boolean
   */
  const currentUser = computed(() => store.state.auth.userInfo)
  const isPayingUser = computed(() => currentUser.value?.stripeStatus === 'active')

  const getPlaydateForDate = ({ date }: { date: string }) => {
    return axios.$get(`/playdates?showChildren=true&date=${date}`)
  }

  const reserveASpot = ({ playdateId, childId, date }: { playdateId: number, childId: number, date: string }) => {
    return axios.$post(`/playdates/${playdateId}/add/children/${childId}?date=${date}`)
  }

  const cancelSpotReservation = ({ playdateId, childId, date }: { playdateId: number, childId: number, date: string }) => {
    return axios.$delete(`/playdates/${playdateId}/remove/children/${childId}?date=${date}`)
  }

  return {
    isPayingUser,
    acceptInvitePlaydate,
    addChildren,
    deletePlaydateInvitation,
    getPlaydateInvite,
    getAndFilterPlaydates,
    getChildrenInfo,
    getPlaydateDays,
    joinPlaydate,
    deleteChildren,
    getPlaydateForDate,
    reserveASpot,
    cancelSpotReservation
  }
}
