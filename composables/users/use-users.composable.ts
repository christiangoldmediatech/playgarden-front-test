import { computed, ref } from '@nuxtjs/composition-api'
import { usePlans } from '@/composables/users'

export const useUsers = () => {
  const { plansResponse, getPlans } = usePlans()

  console.log('plans--', plansResponse)

  return {
    plansResponse,
    getPlans
  }
}
