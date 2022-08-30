import { ref } from '@nuxtjs/composition-api'
import { Entity, Video } from '@/models'
import { jsonCopy, axios } from '@/utils'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'

type VideosFavoritesChildrenResponse = Entity & { video: Video }
type FavoriteId = { favoriteId: number, videoId: number }

const favoriteVideoIds = ref<FavoriteId[]>([])
const isLoadingFavorites = ref(false)

async function getAllFavorites(): Promise<void> {
  const response = await axios.$get('/videos-favorites/children') as VideosFavoritesChildrenResponse[]
  favoriteVideoIds.value = response.map(
    favorite => ({ favoriteId: favorite.id, videoId: favorite.video.id })
  )
}

function getFavoriteVideo(videoId: number): FavoriteId | undefined {
  return favoriteVideoIds.value.find((favorite) => {
    return favorite.videoId === videoId
  })
}

function isVideoFavorite(videoId: number, videoIds?: FavoriteId[]): boolean {
  if (videoIds) {
    return Boolean(videoIds.find((favorite) => {
      return favorite.videoId === videoId
    }))
  }
  return Boolean(getFavoriteVideo(videoId))
}

const curatePlaylist = (playlist: MediaObject[], videoIds?: FavoriteId[]): MediaObject[] => {
  return playlist.map((mediaObject) => {
    const mediaObjectCopy = jsonCopy(mediaObject)
    if (mediaObjectCopy.meta && mediaObjectCopy.meta.videoId) {
      mediaObjectCopy.meta.favorite = isVideoFavorite(mediaObjectCopy.meta.videoId, videoIds)
    }
    return mediaObjectCopy
  })
}

export const useFavorites = () => {
  return {
    isLoadingFavorites,
    favoriteVideoIds,
    isVideoFavorite,
    getFavoriteVideo,
    curatePlaylist,
    getAllFavorites
  }
}
