import { ref } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { Plan } from '@/models'

export const usePlans = () => {
  /**
     * HTTP Request
     */
  const plans = ref<Plan[]>([])

  const getPlans = async () => {
    plans.value = await axios.$get('/plans')
  }

  const saveUser = async ({ data }: {data: unknown}) => {
    plans.value = await axios.$post('/users/admin', data)
  }

  return {
    plans,
    getPlans,
    saveUser
  }
}
