import { ref, watch } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { PlaydatesResponse, Playdate } from '@/models'

enum StatusPlaydate {
  REQUESTED = 'REQUESTED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export const usePlaydates = () => {
  const page = ref(1)
  const total = ref(0)
  const limit = ref(10)
  const states = ref([StatusPlaydate.REQUESTED, StatusPlaydate.PENDING, StatusPlaydate.APPROVED, StatusPlaydate.REJECTED])
  const playdates = ref<Playdate[]>([])
  const playdatesResponse = ref<PlaydatesResponse[]>([])

  watch(playdatesResponse, (val:any) => {
    if (val) {
      page.value = Number(val.page)
      total.value = val.total
      playdates.value = val.playdates
    }
  })

  const getSpecialist = async () => {
    return await axios.$get('/specialists/all')
  }

  const getPlaydatesById = async (id: number) => {
    return await axios.$get(`/playdates/${id}`)
  }

  const getPlaydates = async (params?: unknown) => {
    playdatesResponse.value = await axios.$get('/playdates/list', { params })
  }

  const createPlaydate = async (data: Partial<Playdate>) => {
    return await axios.$post('playdates', data)
  }

  const updatePlaydate = async (id: number, data: Partial<Playdate>) => {
    return await axios.$patch(`/playdates/${id}`, data)
  }

  const deletePlaydate = async (id: number) => {
    return await axios.$delete(`/playdates/${id}`)
  }

  return {
    total,
    page,
    limit,
    playdates,
    playdatesResponse,
    states,
    getSpecialist,
    getPlaydatesById,
    getPlaydates,
    createPlaydate,
    updatePlaydate,
    deletePlaydate
  }
}
