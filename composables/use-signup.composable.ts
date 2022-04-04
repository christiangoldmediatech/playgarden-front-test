import { computed, ref, useRoute, useRouter } from '@nuxtjs/composition-api'
import { Route } from 'vue-router'
import { User, UserFlow } from '@/models'
import { axios } from '@/utils'

enum UserFlowRouteParam {
  NOCREDITCARD = 'promo',
  CREDITCARD = 'normal'
}

interface UseSignup {
  route: Route
}

const abFlow = ref<User['flow']>(UserFlow.CREDITCARD)

export const useSignup = ({ route }: UseSignup) => {
  const isCreditCardRequired = computed(() => abFlow.value === UserFlow.CREDITCARD)

  const setupABFlow = () => {
    abFlow.value = route.name?.includes(`-${UserFlowRouteParam.NOCREDITCARD}-`)
      ? UserFlow.NOCREDITCARD
      : UserFlow.CREDITCARD
  }

  const getABFlow = async () => {
    const abRouteName = ref('')
    const routeABFlow = route.query.abf as UserFlowRouteParam

    // if the AB flow is already in the query, set the corresponding user flow
    if (typeof routeABFlow === 'string' && [UserFlowRouteParam.NOCREDITCARD, UserFlowRouteParam.CREDITCARD].includes(routeABFlow)) {
      switch (routeABFlow) {
        case UserFlowRouteParam.NOCREDITCARD:
          abRouteName.value = 'auth-promo-parent'
          break
        case UserFlowRouteParam.CREDITCARD:
          abRouteName.value = 'auth-normal-parent'
          break
      }
    // else, set the flow returned by the api and set the corresponding route
    } else {
      const response = await axios.$get('/auth/users/flow') as { flow: User['flow'] }

      switch (response.flow) {
        case UserFlow.NOCREDITCARD:
          abRouteName.value = 'auth-promo-parent'
          break
        case UserFlow.CREDITCARD:
          abRouteName.value = 'auth-normal-parent'
          break
      }
    }

    // [sc-3477] The client won't use promo routes for now.
    abRouteName.value = 'auth-normal-parent'

    return abRouteName.value
  }

  return {
    abFlow,
    isCreditCardRequired,
    getABFlow,
    setupABFlow
  }
}
