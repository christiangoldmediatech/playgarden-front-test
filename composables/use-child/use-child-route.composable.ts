import { Child, TypedStore } from '@/models'
import { ref, useRoute, useRouter, watch, computed } from '@nuxtjs/composition-api'
import { Store } from 'vuex/types'
import { useChild } from './use-child.composable'

interface UseChildRouteParams {
  store: Store<TypedStore>,
  route: ReturnType<typeof useRoute>
  router: ReturnType<typeof useRouter>
}

export const useChildRoute = ({ store, route, router }: UseChildRouteParams) => {
  const childId = ref<number | null>(null)
  const childRouteId = computed(() => route.value.query.id)

  const resolveChildId = () => {
    const { currentChildren } = useChild({ store })
    // Check if child id exists in route, if so use that value
    if (typeof childRouteId.value === 'string' || typeof childRouteId.value === 'number') {
      childId.value = parseInt(childRouteId.value)
      return
    }
    // If no child in route is present, use the current children id
    if (currentChildren.value && currentChildren.value.length > 0) {
      childId.value = currentChildren.value[0].id
      return
    }

    childId.value = null
  }

  const setCurrentChildToRoute = (id: number) => {
    if (id && route.value.name) {
      // Update received child id in the store
      const child = store.getters['children/rows'].find(({ id: foundId }: Child) => foundId === id)

      if (child) {
        store.dispatch('setChild', { value: [child], save: true })
      }
      // Update route with updated child id
      router.push({
        name: route.value.name,
        query: {
          id: `${id}`
        }
      })
    }
  }

  watch(childRouteId, () => {
    resolveChildId()
  }, { immediate: true })

  watch(childId, (val) => {
    if (val) {
      setCurrentChildToRoute(val)
    }
  })

  return {
    childId,
    resolveChildId,
    setCurrentChildToRoute
  }
}
