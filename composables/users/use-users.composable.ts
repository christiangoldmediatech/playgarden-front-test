import { computed, ref } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { User } from '@/models'
import { usePlans } from '@/composables/users'

export const useUsers = () => {
  const user = ref<User>()
  const { getPlans } = usePlans()

  const dataPlans = computed(async () => await getPlans())
  const getUser = async (userId: number) => {
    user.value = await axios.$get(`/users/${userId}`)
  }

  return {
    user,
    getPlans,
    getUser
  }
}
