import { ref, watch } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { MeetingsResponse, Meeting, TypedStore } from '@/models'
import { Store } from 'vuex/types'

interface UsePlaydatesParams {
  store: Store<TypedStore>,
}

enum StatusPlaydate {
  REQUESTED = 'REQUESTED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export const usePlaydates = ({ store }: UsePlaydatesParams) => {
  const page = ref(1)
  const total = ref(0)
  const limit = ref(10)
  const states = ref([StatusPlaydate.REQUESTED, StatusPlaydate.PENDING, StatusPlaydate.APPROVED, StatusPlaydate.REJECTED])
  const playdates = ref<Meeting[]>([])
  const playdatesResponse = ref<MeetingsResponse[]>([])

  watch(playdatesResponse, (val:any) => {
    if (val) {
      page.value = Number(val.page)
      total.value = val.total
      playdates.value = val.meetings
    }
  })

  const getSpecialist = async () => {
    return await axios.$get('/specialists/all')
  }

  const getCurriculumTypes = async () => {
    let curriculumTypes = store.getters['admin/curriculum/types']

    if (curriculumTypes.length === 0) {
      curriculumTypes = await store.dispatch('admin/curriculum/getTypes')
    }

    return curriculumTypes
  }

  const getActivityTypes = async () => {
    return await axios.$get('/activity-types')
  }

  const getPlaydatesById = async (id: number) => {
    return await axios.$get(`/live-sessions/${id}`)
  }

  const getPlaydates = async (params?: unknown) => {
    playdatesResponse.value = await axios.$get('/live-sessions', { params })
  }

  const createPlaydate = async (data: Partial<Meeting>) => {
    return await axios.$post('/live-sessions', data)
  }

  const updatePlaydate = async (id: number, data: Partial<Meeting>) => {
    return await axios.$patch(`/live-sessions/${id}`, data)
  }

  const deletePlaydate = async (id: number) => {
    return await axios.$delete(`/live-sessions/${id}`)
  }

  return {
    total,
    page,
    limit,
    playdates,
    playdatesResponse,
    states,
    getSpecialist,
    getCurriculumTypes,
    getActivityTypes,
    getPlaydatesById,
    getPlaydates,
    createPlaydate,
    updatePlaydate,
    deletePlaydate
  }
}
