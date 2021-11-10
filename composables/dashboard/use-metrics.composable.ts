import { ref } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { Metrics } from '@/models'

export const useMetrics = () => {
  const metrics = ref<Metrics>()

  const getMetrics = async () => {
    metrics.value = await axios.$get('/dashboard/metrics')
  }

  return {
    metrics,
    getMetrics
  }
}
