import { ref } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { Metrics, TopVideo } from '@/models'

export const useMetrics = () => {
  const metrics = ref<Metrics>()
  const topVideos = ref<TopVideo[]>([])

  const getMetrics = async () => {
    metrics.value = await axios.$get('/dashboard/metrics')
  }

  const getTopFavoritesVideos = async () => {
    topVideos.value = await axios.$get('/videos-favorites/top')
  }

  const getTopVideosByState = async (params?: unknown) => {
    return await axios.$get('/logs/top/videos/state', { params })
  }

  return {
    metrics,
    topVideos,
    getMetrics,
    getTopFavoritesVideos,
    getTopVideosByState
  }
}
