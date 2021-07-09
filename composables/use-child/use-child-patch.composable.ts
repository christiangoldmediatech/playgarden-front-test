import { Patches } from '@/models'
import { axios } from '@/utils'

export const useChildPatch = () => {
  const getPatchesByChildId = (id: number): Promise<Patches> => {
    return axios.$get(`/children/${id}/patches`)
  }

  return {
    getPatchesByChildId
  }
}
