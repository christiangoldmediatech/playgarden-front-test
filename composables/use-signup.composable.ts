import { computed, ref, useRoute, useRouter } from '@nuxtjs/composition-api'
import { User, UserFlow } from '@/models'
import { axios } from '@/utils'

const abFlow = ref<User['flow']>(UserFlow.CREDITCARD)

enum UserFlowRouteQuery {
  NOCREDITCARD = 'promo',
  CREDITCARD = 'normal'
}

export const useSignup = ({ router, route }: { router: ReturnType<typeof useRouter>, route: ReturnType<typeof useRoute> }) => {
  const isCreditCardRequired = computed(() => abFlow.value === UserFlow.CREDITCARD)

  const setupABFlow = async () => {
    let routeABFlow = route.value.query.abf as UserFlowRouteQuery

    // if the AB flow is already in the query, set the corresponding user flow
    if (typeof routeABFlow === 'string' && [UserFlowRouteQuery.NOCREDITCARD, UserFlowRouteQuery.CREDITCARD].includes(routeABFlow)) {
      switch (routeABFlow) {
        case UserFlowRouteQuery.NOCREDITCARD:
          abFlow.value = UserFlow.NOCREDITCARD
          break
        case UserFlowRouteQuery.CREDITCARD:
          abFlow.value = UserFlow.CREDITCARD
          break
      }
    // else, set the flow returned by the api and set the corresponding route query
    } else {
      const response = await axios.$get('/auth/users/flow') as { flow: User['flow'] }

      switch (response.flow) {
        case UserFlow.NOCREDITCARD:
          routeABFlow = UserFlowRouteQuery.NOCREDITCARD
          break
        case UserFlow.CREDITCARD:
          routeABFlow = UserFlowRouteQuery.CREDITCARD
          break
      }

      abFlow.value = response.flow
    }

    router.push({
      name: 'auth-parent',
      query: {
        abf: routeABFlow
      }
    })
  }

  return {
    abFlow,
    isCreditCardRequired,
    setupABFlow
  }
}
