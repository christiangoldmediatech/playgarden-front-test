import { gtmAttributes } from '@/types/gtm'
import { Store } from 'vuex'
import { axios } from '@/utils'
import { TAG_MANAGER_EVENTS } from '@/models'
import { useFavorites } from './use-favorites.composable'

const { getFavoriteVideo, getAllFavorites } = useFavorites()

const addFavorite = (videoId: number) => {
  return axios.post('/videos-favorites', {
    videoId
  })
}

const deleteFavorite = (favoriteId: number) => {
  return axios.delete(`/videos-favorites/${favoriteId}`)
}

export const useFavoritesApi = ({ gtm, store }: { gtm: gtmAttributes[], store: Store<unknown> }) => {
  const handleFavorite = (videoId: number, topic: string) => {
    const favoriteVideo = getFavoriteVideo(videoId)
    if (favoriteVideo) {
      return deleteFavorite(favoriteVideo.id)
    } else {
      gtm.push({
        event: TAG_MANAGER_EVENTS.LIBRARY_ADD_VIDEO_TO_FAVORITES,
        userId: store.getters['auth/getUserInfo'].id,
        topic
      })
      return addFavorite(videoId)
    }
  }

  return {
    handleFavorite,
    getAllFavorites
  }
}
