import { Child, Playdate, Playdates } from '@/models'
import { axios } from '@/utils'

export const usePlaydates = () => {
  const acceptInvitePlaydate = (token: string) => {
    return axios.$get(`/playdates/accept/invite/${token}`)
  }

  const addChildren = ({ id, data }: { id: number, data: unknown }): Promise<Playdate[]> => {
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

  const getPlaydateDays = (): Promise<{ days: string[] }> => {
    return axios.$get('/playdates/days/available')
  }

  const joinPlaydate = ({ playdateId, childId }: { playdateId: number, childId: number }) => {
    return axios.$post(`/playdates/${playdateId}/add/children/${childId}`)
  }

  const deleteChildren = ({ playdateId, childId }: { playdateId: number, childId: number }) => {
    return axios.$delete(`/playdates/${playdateId}/remove/children/${childId}`)
  }

  return {
    acceptInvitePlaydate,
    addChildren,
    deletePlaydateInvitation,
    getPlaydateInvite,
    getAndFilterPlaydates,
    getChildrenInfo,
    getPlaydateDays,
    joinPlaydate,
    deleteChildren
  }
}
