import { ref, useRoute, useRouter } from '@nuxtjs/composition-api'
import { User } from '@/models'

const abFlow = ref<User['flow']>('CREDITCARD')

export const useSignup = ({ router, route }: { router: ReturnType<typeof useRouter>, route: ReturnType<typeof useRoute> }) => {
  const setupABFlow = () => {
    const routeABFlow = route.value.query.abf

    if (typeof routeABFlow === 'string' && ['NOCREDITCARD', 'CREDITCARD'].includes(routeABFlow)) {
      abFlow.value = route.value.query.abf as User['flow']
    } else {
      // TODO: fetch flow from server
      abFlow.value = 'NOCREDITCARD'
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
