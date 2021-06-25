import { axios } from '@/utils'

export const useChildPatch = () => {
  const getPatchesByChildId = (id: number) => {
    return axios.$get(`/children/${id}/patches`)
  }

  return {
    getPatchesByChildId
  }
}
