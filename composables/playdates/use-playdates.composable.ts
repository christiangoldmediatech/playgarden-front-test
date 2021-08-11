import { ref } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { PlaydatesResponse } from '@/models'

export const usePlaydates = () => {
  const playdatesResponse = ref<PlaydatesResponse[]>([])

  const getPlaydates = async (params?: unknown) => {
    playdatesResponse.value = await axios.$get('/playdates/list', { params })
  }
  return {
    playdatesResponse,
    getPlaydates
  }
}
