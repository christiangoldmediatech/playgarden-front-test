import { ref } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { Video } from '~/models'

export const useVideos = () => {
  const videos = ref<Array<Video>>([])
  const getVideos = async (lessonId: number) => {
    videos.value = await axios.$get(`/lessons/${lessonId}/videos/random`)
  }

  return {
    videos,
    getVideos
  }
}
