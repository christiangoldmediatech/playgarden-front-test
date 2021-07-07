import { computed, ref } from '@nuxtjs/composition-api'
import { Entity, Video, APP_EVENTS } from '@/models'
import { axios } from '@/utils'
import { useNuxtHelper, useAppEventBusHelper } from '@/composables'

type VideosFavoritesChildrenResponse = Entity & { video: Video }

const favoriteVideos = ref<VideosFavoritesChildrenResponse[]>([])

export const useLibrary = (videoId?: number) => {
  const nuxt = useNuxtHelper()
  const eventBus = useAppEventBusHelper()

  const isLoadingFavorites = ref(false)

  const favoriteVideo = computed(() => favoriteVideos.value.find(favorite => favorite.video.id === videoId))
  const isFavoriteVideo = computed(() => Boolean(favoriteVideo.value))

  const getAllFavorites = async () => {
    favoriteVideos.value = await axios.$get('/videos-favorites/children')
  }

  const addFavorite = async (videoId: number) => {
    const { data } = await axios.post('/videos-favorites', {
      videoId
    })

    return data
  }

  const deleteFavorite = async (videoId: number) => {
    const { data } = await axios.delete(`/videos-favorites/${videoId}`)

    return data
  }

  const handleFavorite = async () => {
    try {
      if (!videoId) {
        return
      }

      isLoadingFavorites.value = true

      if (favoriteVideo.value?.id) {
        await deleteFavorite(favoriteVideo.value.id)
      } else {
        await addFavorite(videoId)
        eventBus.$emit(APP_EVENTS.LIBRARY_ADD_VIDEO_TO_FAVORITES, videoId)
      }

      nuxt.$emit('library-update-favorites')

      await getAllFavorites()
    } finally {
      isLoadingFavorites.value = false
    }
  }

  return {
    isLoadingFavorites,
    videoId,
    isFavoriteVideo,
    handleFavorite,
    getAllFavorites
  }
}
