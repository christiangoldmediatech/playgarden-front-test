import { ref } from '@nuxtjs/composition-api'
import { Entity, Video } from '@/models'
import { jsonCopy, axios } from '@/utils'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'

type VideosFavoritesChildrenResponse = Entity & { video: Video }

const favoriteVideos = ref<VideosFavoritesChildrenResponse[]>([])
const favoriteVideoIds = ref<number[]>([])
const isLoadingFavorites = ref(false)

const getAllFavorites = async () => {
  favoriteVideos.value = await axios.$get('/videos-favorites/children')
  favoriteVideoIds.value = favoriteVideos.value.map(
    favorite => favorite.video.id
  )
}

const getFavoriteVideo = (videoId: number) => {
  return favoriteVideos.value.find((favorite) => {
    return favorite.video.id === videoId
  })
}

const isVideoFavorite = (videoId: number) => {
  return favoriteVideoIds.value.includes(videoId)
}

const curatePlaylist = (playlist: MediaObject[]): MediaObject[] => {
  return playlist.map((mediaObject) => {
    const mediaObjectCopy = jsonCopy(mediaObject)
    if (mediaObjectCopy.meta && mediaObjectCopy.meta.videoId) {
      mediaObjectCopy.meta.favorite = isVideoFavorite(
        mediaObjectCopy.meta.videoId
      )
    }
    return mediaObjectCopy
  })
}

export const useFavorites = () => {
  return {
    isLoadingFavorites,
    favoriteVideos,
    favoriteVideoIds,
    isVideoFavorite,
    getFavoriteVideo,
    curatePlaylist,
    getAllFavorites
  }
}
