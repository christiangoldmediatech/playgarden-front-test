import { ref } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { Plan, Coupon, User } from '@/models'

export const usePlans = () => {
  /**
   * HTTP Requests
   */
  const plans = ref<Plan[]>([])
  const coupons = ref<Coupon[]>([])

  const getPlans = async () => {
    plans.value = await axios.$get('/plans')
  }

  const getCoupons = async (params: any) => {
    coupons.value = await axios.$get('/coupons', { params })
  }

  const saveUser = async ({ data }: {data: any}) => {
    plans.value = await axios.$post('/users/admin', data)
  }

  return {
    plans,
    coupons,
    getPlans,
    getCoupons,
    saveUser
  }
}
