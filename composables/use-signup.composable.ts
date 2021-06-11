import { ref, useRoute, useRouter } from '@nuxtjs/composition-api'
import { User } from '@/models'
import { axios } from '@/utils'

const abFlow = ref<User['flow']>('CREDITCARD')

export const useSignup = ({ router, route }: { router: ReturnType<typeof useRouter>, route: ReturnType<typeof useRoute> }) => {
  const setupABFlow = async () => {
    const routeABFlow = route.value.query.abf

    if (typeof routeABFlow === 'string' && ['NOCREDITCARD', 'CREDITCARD'].includes(routeABFlow)) {
      abFlow.value = route.value.query.abf as User['flow']
    } else {
      const response = await axios.$get('/auth/users/flow') as { flow: User['flow'] }
      abFlow.value = response.flow
    }

    router.push({
      name: 'auth-parent',
      query: {
        abf: abFlow.value
      }
    })
  }

  return {
    abFlow,
    setupABFlow
  }
}
