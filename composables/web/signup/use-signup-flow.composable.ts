import { useAccessorHelper } from '@/composables/helpers.composable'
import { Flow } from '@/composables/users/enums/flow.enum'
import { computed, ref } from '@nuxtjs/composition-api'
import { UserFlowRouteParam, UserFlowRoute } from './enums'
import { UseSignupFlowOptions } from './types'

export const useSignupFlow = ({ route }: UseSignupFlowOptions) => {
  const store = useAccessorHelper().auth.signup

  const abFlow = computed<Flow>({
    get() {
      return store.abFlow
    },

    set(abFlow: Flow) {
      store.SET_AB_FLOW(abFlow)
    }
  })

  const isCreditCardRequired = computed<boolean>(
    () => abFlow.value === Flow.CREDITCARD
  )

  console.log('isCreditCardRequiered', route.query.abf)

  async function getABFlow(): Promise<UserFlowRoute> {
    const abRouteName = ref<UserFlowRoute>(UserFlowRoute.NORMAL)
    const routeABFlow = route.query.abf as UserFlowRouteParam

    // If the AB flow was already changed, use that one
    if (abFlow.value === Flow.NOCREDITCARD) {
      abRouteName.value = UserFlowRoute.PROMO
      // if the AB flow is already in the query, set the corresponding user flow
    } else if (
      typeof routeABFlow === 'string' &&
      [UserFlowRouteParam.NOCREDITCARD, UserFlowRouteParam.CREDITCARD].includes(
        routeABFlow
      )
    ) {
      switch (routeABFlow) {
        case UserFlowRouteParam.NOCREDITCARD:
          abRouteName.value = UserFlowRoute.PROMO
          break
        case UserFlowRouteParam.CREDITCARD:
          abRouteName.value = UserFlowRoute.NORMAL
          break
      }
      // else, set the flow returned by the api and set the corresponding route
    } else {
      const flow = await store.fetchUserFlow()

      switch (flow) {
        case Flow.NOCREDITCARD:
          abRouteName.value = UserFlowRoute.PROMO
          break
        case Flow.CREDITCARD:
          abRouteName.value = UserFlowRoute.NORMAL
          break
      }
    }

    // [sc-3477] The client won't use promo routes for now.
    abRouteName.value = UserFlowRoute.NORMAL

    return abRouteName.value
  }

  return {
    abFlow,
    isCreditCardRequired,
    getABFlow
  }
}
