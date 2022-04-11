import { ref } from '@nuxtjs/composition-api'
import {
  FavoriteListResponse,
  ActivitiesFavoriteResponse
} from '@/models'
import { useLibraryHelpers, useFavorites } from '@/composables'
import { axios } from '@/utils'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'

const libraryFavoritePlaylist = ref<MediaObject[]>([])

export const useLibraryFavorites = () => {
  const { videoToMediaObject, getValidVideos } = useLibraryHelpers()
  const { getAllFavorites, curatePlaylist } = useFavorites()

  async function getLibraryFavoriteActivities() {
    try {
      const [response] = await Promise.all([
        axios.$get('/activities?favorites=1') as unknown as ActivitiesFavoriteResponse,
        getAllFavorites()
      ])

      const videos = getValidVideos(response.favorites.map(({ video }) => video))
      const playlist: MediaObject[] = videos.map((video, index) => videoToMediaObject(video, index, video.activityType))
      libraryFavoritePlaylist.value = curatePlaylist(playlist)
    } catch (error) {
      Promise.reject(error)
    }
  }

  return {
    libraryFavoritePlaylist,
    getLibraryFavoriteActivities
  }
}
