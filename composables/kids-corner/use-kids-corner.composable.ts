import { ref, watch } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { KidsCornerVideo, KidsCornerVideoResponse } from '@/models'

export const useKidsCorner = () => {
  const page = ref(1)
  const total = ref(0)
  const limit = ref(10)
  const kidsCornerVideoResponse = ref<KidsCornerVideoResponse[]>([])
  const KidsCornerVideos = ref<KidsCornerVideo[]>([])

  watch(kidsCornerVideoResponse, (val:any) => {
    if (val) {
      page.value = Number(val.page)
      total.value = val.total
      KidsCornerVideos.value = val.kidscorner
    }
  })

  const getKidsCorner = async (params?: unknown) => {
    kidsCornerVideoResponse.value = await axios.$get('/kids-corner', { params })
  }

  const getKidsCornerById = async (id:number) => {
    return await axios.$get(`/kids-corner/${id}`)
  }
  const saveKidsCorner = async ({ data }: {data: any}) => {
    return await axios.$post('/kids-corner', data)
  }
  const updateKidsCorner = async (id:number, { data }: {data: any}) => {
    return await axios.$patch(`/kids-corner/${id}`, data)
  }
  const deleteKidsCorner = async (id: number) => {
    return await axios.$delete(`/kids-corner/${id}`)
  }
  return {
    total,
    page,
    limit,
    kidsCornerVideoResponse,
    KidsCornerVideos,
    getKidsCornerById,
    getKidsCorner,
    saveKidsCorner,
    updateKidsCorner,
    deleteKidsCorner
  }
}
