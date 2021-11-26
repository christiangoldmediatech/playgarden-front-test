import dayjs from 'dayjs'
import { Child, Playdate, Playdates, TypedStore } from '@/models'
import { axios } from '@/utils'
import { computed } from '@nuxtjs/composition-api'
import { Store } from 'vuex/types'

interface UseChildPlaydates {
  store: Store<TypedStore>
}

export const usePlaydates = ({ store }: UseChildPlaydates) => {
  const acceptInvitePlaydate = (token: string) => {
    return axios.$get(`/live-sessions/accept/invite/${token}`)
  }

  const addChildren = ({ id, data }: { id: number, data: unknown }) => {
    return axios.$post(`/playdate/adding/children/${id}`, data)
  }

  const deletePlaydateInvitation = (token: string) => {
    return axios.$delete(`/live-sessions/invite/${token}`)
  }

  const getPlaydateByDate = (params: any) => {
    return axios.$get('/live-sessions/', { params })
  }

  const getPlaydateInvite = (token: string) => {
    return axios.$get(`/live-sessions/invite/${token}`)
  }

  const getAndFilterPlaydates = (params: { day?: string }): Promise<Playdate[]> => {
    return axios.$get('/live-sessions/show-children', { params })
  }

  const getChildrenInfo = (): Promise<{ children: Child; playdates: Playdates[], groups: { groupedDate: string, playdates: { backpackImages: [], date: string, playdate: Playdate }[] }[] }[]> => {
    return axios.$get('/live-sessions/my/playdates')
  }

  const getPlaydateDays = async (): Promise<{ days: string[] }> => {
    return await axios.$get('/live-sessions/days/available')
  }

  const joinPlaydate = ({ playdateId, childId }: { playdateId: number, childId: number }) => {
    return axios.$post(`/live-sessions/${playdateId}/add/children/${childId}`)
  }

  const deleteChildren = ({ playdateId, childId }: { playdateId: number, childId: number }) => {
    return axios.$delete(`/live-sessions/${playdateId}/remove/children/${childId}`)
  }

  /**
   * The playdates screen is only visible to paying users, users whose
   * stripe_status is 'active'
   * @returns boolean
   */
  const currentUser = computed(() => store.state.auth.userInfo)
  const isPayingUser = computed(() => currentUser.value?.stripeStatus === 'active')

  /**
   * Because the user can scroll to 3 weeks in advance, we need a function
   * that returns an array of dates from now to 3 weeks ahead.
   * @returns {array}
   */
  const getPlaydatesDates = () => {
    const WEEKS_AHEAD = 3
    const dates: string[] = []
    const weeksAhead = dayjs().add(WEEKS_AHEAD, 'weeks').format('YYYY-MM-DD')
    let now = dayjs().format('YYYY-MM-DD')

    while (dayjs(now).isBefore(weeksAhead)) {
      dates.push(now)
      now = dayjs(now).add(1, 'week').format('YYYY-MM-DD')
    }

    return dates
  }

  const getPlaydateForDate = ({ date }: { date: string }): Promise<Playdate[]> => {
    return axios.$get(`/live-sessions/show-children?&date=${date}`)
  }

  const reserveASpot = ({ playdateId, childId, date }: { playdateId: number, childId: number, date: string }) => {
    return axios.$post(`/playdate/${playdateId}/add/children/${childId}?date=${date}`)
  }

  const cancelSpotReservation = ({ playdateId, childId, date }: { playdateId: number, childId: number, date: string }) => {
    return axios.$delete(`/playdate/${playdateId}/remove/children/${childId}?date=${date}`)
  }

  return {
    isPayingUser,
    getPlaydatesDates,
    acceptInvitePlaydate,
    addChildren,
    getPlaydateByDate,
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
