import { ref, watch } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { PlaydatesResponse, Playdate } from '@/models'

export const usePlaydates = () => {
  const page = ref<Number>(1)
  const total = ref<Number>(0)
  const limit = ref<Number>(10)
  const playdates = ref<Playdate[]>([])
  const playdatesResponse = ref<PlaydatesResponse[]>([])

  watch(playdatesResponse, (val:any) => {
    if (val) {
      page.value = Number(val.page)
      total.value = val.total
      playdates.value = val.playdates
    }
  })

  const getPlaydates = async (params?: unknown) => {
    playdatesResponse.value = await axios.$get('/playdates/list', { params })
  }
  return {
    total,
    page,
    limit,
    playdates,
    playdatesResponse,
    getPlaydates
  }
}
