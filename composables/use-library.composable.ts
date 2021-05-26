import { ref } from '@nuxtjs/composition-api'
import { Entity, Video } from '@/models'
import { axios } from '@/utils'

type VideosFavoritesChildrenResponse = Array<Entity & { video: Video }>

const favoriteVideos = ref<VideosFavoritesChildrenResponse>([])

export const useLibrary = () => {
  const getAllFavorites = async () => {
    favoriteVideos.value = await axios.$get('/videos-favorites/children')
  }

  return {
    getAllFavorites
  }
}
