import { Ref } from '@nuxtjs/composition-api'
import { gtmAttributes } from '@/types/gtm'
import { Store } from 'vuex'
import { axios } from '@/utils'
import { TAG_MANAGER_EVENTS } from '@/models'
import { PlayerInstanceEvent } from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'
import { useFavorites } from './use-favorites.composable'

const { getFavoriteVideo, getAllFavorites, favoriteVideoIds } = useFavorites()

function addFavorite(videoId: number): Promise<any> {
  return axios.post('/videos-favorites', {
    videoId
  })
}

function deleteFavorite(favoriteId: number): Promise<any> {
  return axios.delete(`/videos-favorites/${favoriteId}`)
}

type UseFavoritesApiParams = {
  gtm: gtmAttributes[],
  store: Store<unknown>,
  isHandlingFavorites?: Ref<boolean>
}

export const useFavoritesApi = ({ gtm, store, isHandlingFavorites }: UseFavoritesApiParams) => {
  // Basic favorites handling
  async function handleFavorite(videoId: number, topic: string): Promise<any> {
    try {
      const favoriteVideo = getFavoriteVideo(videoId)
      if (favoriteVideo) {
        await deleteFavorite(favoriteVideo.favoriteId)
        favoriteVideoIds.value = favoriteVideoIds.value.filter(entry => entry.videoId !== videoId || entry.favoriteId !== favoriteVideo.favoriteId)
      } else {
        gtm.push({
          event: TAG_MANAGER_EVENTS.LIBRARY_ADD_VIDEO_TO_FAVORITES,
          userId: store.getters['auth/getUserInfo'].id,
          topic
        })
        const { data } = await addFavorite(videoId)
        favoriteVideoIds.value.push({ favoriteId: data.id, videoId })
      }
    } catch (error) {
      Promise.reject(error)
    }
  }

  // Simplified for pg video player
  async function handleFavoritesClicked(event: PlayerInstanceEvent) {
    try {
      if (isHandlingFavorites) {
        isHandlingFavorites.value = true
      }
      const currentTrack = event.currentTrack
      if (currentTrack) {
        const videoId = currentTrack.meta?.videoId
        const topic = currentTrack.title
        if (videoId && topic) {
          await handleFavorite(videoId, topic)
        }
      }
    } catch (error) {
      Promise.reject(error)
    } finally {
      if (isHandlingFavorites) {
        isHandlingFavorites.value = false
      }
    }
  }

  return {
    handleFavorite,
    getAllFavorites,
    handleFavoritesClicked
  }
}
