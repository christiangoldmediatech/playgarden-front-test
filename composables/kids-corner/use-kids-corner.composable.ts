import { ref } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { KidsCornerVideo } from '@/models'

export const useKidsCorner = () => {
  const kidsCornerVideo = ref<Partial<KidsCornerVideo>>({
    name: '',
    description: '',
    thumbnail: '',
    curriculumTypeId: null,
    reportCardTypeId: null,
    videoId: null,
    topics: []
  })

  const getKidsCornerById = async (id:number) => {
    kidsCornerVideo.value = await axios.$get(`/kids-corner/${id}`)
  }
  const saveKidsCorner = async ({ data }: {data: any}) => {
    kidsCornerVideo.value = await axios.$post('/kids-corner', data)
  }
  const updateKidsCorner = async (id:number, { data }: {data: any}) => {
    kidsCornerVideo.value = await axios.$patch(`/kids-corner/${id}`, data)
  }
  return {
    kidsCornerVideo,
    getKidsCornerById,
    saveKidsCorner,
    updateKidsCorner
  }
}
