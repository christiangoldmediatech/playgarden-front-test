import { ref } from '@nuxtjs/composition-api'
import { axios } from '@/utils'

export const usePatches = () => {
  /**
   * HTTP Requests
   */
  const patches = ref<any[]>([])

  const getPatchesByChildId = async (id: number) => {
    patches.value = await axios.$get(`/children/${id}/patches`)
    console.log('patces get--', patches.value)
  }

  return {
    patches
  }
}
