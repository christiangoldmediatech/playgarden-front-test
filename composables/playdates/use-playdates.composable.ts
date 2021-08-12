import { ref, watch } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { PlaydatesResponse, Playdate } from '@/models'

export const usePlaydates = () => {
  const page = ref<Number>(1)
  const total = ref<Number>(0)
  const limit = ref<Number>(10)
  const states = ref(['REQUESTED', 'PENDING', 'APPROVED', 'REJECTED'])
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

  const createPlaydate = async (id: number, data: Partial<Playdate>) => {
    return await axios.$post('playdates', data)
  }

  const updatePlaydate = async (id: number, data: Partial<Playdate>) => {
    return await axios.$patch(`/playdates/${id}`, data)
  }

  const deletePlayadte = async (id: number) => {
    return await axios.$delete(`/playdates/${id}`)
  }
  return {
    total,
    page,
    limit,
    playdates,
    playdatesResponse,
    states,
    getPlaydates,
    createPlaydate,
    updatePlaydate,
    deletePlayadte
  }
}
