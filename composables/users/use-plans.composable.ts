import { ref } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { Plan, PlanResponse } from '@/models'

export const usePlans = () => {
  /**
     * HTTP Request
     */
  const plans = ref<Plan[]>([])
  const plansResponse = ref<PlanResponse[]>([])
  const getPlans = async () => {
    plans.value = await axios.$get('/plans')
  }
  plansResponse.value = plans.value.map(plan => ({
    text: plan.name,
    value: plan.id
  }))

  return {
    plans,
    plansResponse,
    getPlans
  }
}
