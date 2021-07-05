import { ref } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { ChildrenPatchesActivity } from '@/models'
const { get } = require('lodash')

export const usePatches = () => {
  /**
   * HTTP Requests
   */
  const childrenPatchesActivity = ref<ChildrenPatchesActivity[]>([])

  const getPatchesByChildId = async (id: number) => {
    childrenPatchesActivity.value = await axios.$get(`/children/${id}/patches`)
    childrenPatchesActivity.value = childrenPatchesActivity.value.filter(item => get(item, 'patches', []).length)
  }

  return {
    childrenPatchesActivity,
    getPatchesByChildId
  }
}
