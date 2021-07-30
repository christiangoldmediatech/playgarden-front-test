import { ref } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { Plan, Coupon, User } from '@/models'

export const usePlans = () => {
  /**
     * HTTP Request
     */
  const plans = ref<Plan[]>([])
  const coupons = ref<Coupon[]>([])
  const user = ref<User>()

  const getPlans = async () => {
    plans.value = await axios.$get('/plans')
  }

  const getCoupons = async (params: any) => {
    coupons.value = await axios.$get('/coupons', { params })
  }

  const saveUser = async ({ data }: {data: unknown}) => {
    plans.value = await axios.$post('/users/admin', data)
  }

  return {
    user,
    plans,
    coupons,
    getPlans,
    getCoupons,
    saveUser
  }
}
