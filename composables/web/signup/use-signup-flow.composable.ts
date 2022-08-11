import { Flow } from '@/composables/users/enums/flow.enum'
import { computed, ref } from '@nuxtjs/composition-api'
import { UserFlowRouteParam } from './enums/user-flow-route-param.enum'
import { UserFlowRoute } from './enums/user-flow-route.enum'
import { UseSignupFlowOptions } from './types/use-signup-flow-options.type'

export const useSignupFlow = ({ route, store }: UseSignupFlowOptions) => {
  const abFlow = computed<Flow>({
    get() {
      return route.name?.includes(`-${UserFlowRouteParam.NOCREDITCARD}-`)
        ? Flow.NOCREDITCARD
        : store.abFlow
    },

    set(abFlow: Flow) {
      store.SET_AB_FLOW(abFlow)
    }
  })

  const isCreditCardRequired = computed<boolean>(
    () => abFlow.value === Flow.CREDITCARD
  )

  async function getABFlow(): Promise<UserFlowRoute> {
    const abRouteName = ref<UserFlowRoute>(UserFlowRoute.NORMAL)
    const routeABFlow = route.query.abf as UserFlowRouteParam

    // if the AB flow is already in the query, set the corresponding user flow
    if (
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
