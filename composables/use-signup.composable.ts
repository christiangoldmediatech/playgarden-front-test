import { ref, useRoute, useRouter } from '@nuxtjs/composition-api'
import { User, UserFlow } from '@/models'
import { axios } from '@/utils'

const abFlow = ref<User['flow']>(UserFlow.CREDITCARD)

export const useSignup = ({ router, route }: { router: ReturnType<typeof useRouter>, route: ReturnType<typeof useRoute> }) => {
  const setupABFlow = async () => {
    const routeABFlow = route.value.query.abf as UserFlow

    if (typeof routeABFlow === 'string' && [UserFlow.NOCREDITCARD, UserFlow.CREDITCARD].includes(routeABFlow)) {
      abFlow.value = routeABFlow
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
