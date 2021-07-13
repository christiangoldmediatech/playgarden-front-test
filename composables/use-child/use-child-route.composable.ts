import { TypedStore } from '@/models'
import { ref, useRoute, useRouter, watch } from '@nuxtjs/composition-api'
import { Store } from 'vuex/types'
import { useChild } from './use-child.composable'

interface UseChildRouteParams {
  store: Store<TypedStore>,
  route: ReturnType<typeof useRoute>
  router: ReturnType<typeof useRouter>
}

export const useChildRoute = ({ store, route, router }: UseChildRouteParams) => {
  const childId = ref<number | null>(null)

  const resolveChildId = () => {
    const { currentChildren } = useChild({ store })
    const routeId = route.value.query.id

    if (typeof routeId === 'string' || typeof routeId === 'string') {
      childId.value = parseInt(routeId)
      return
    }

    if (currentChildren.value && currentChildren.value.length > 0) {
      childId.value = currentChildren.value[0].id
      return
    }

    childId.value = null
  }

  watch(childId, (val) => {
    if (val) {
      setCurrentChildToRoute(val)
    }
  })

  const setCurrentChildToRoute = (id: number) => {
    if (id && route.value.name) {
      router.push({
        name: route.value.name,
        query: {
          id: `${id}`
        }
      })
    }
  }

  return {
    childId,
    resolveChildId
  }
}
