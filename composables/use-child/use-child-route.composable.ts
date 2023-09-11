import { Child, TypedStore } from '@/models'
import { ref, useRoute, useRouter, watch, computed } from '@nuxtjs/composition-api'
import { Store } from 'vuex/types'
import { useTutorialQuery } from '@/composables/tutorial/use-tutorial.composable'
import { useChild } from './use-child.composable'
import type { RawLocation } from 'vue-router'
interface UseChildRouteParams {
  store: Store<TypedStore>,
  route: ReturnType<typeof useRoute>
  router: ReturnType<typeof useRouter>
  shouldRedirect?: boolean
}

export const useChildRoute = ({ store, route, router, shouldRedirect = false }: UseChildRouteParams) => {
  const childId = ref<number | null>(null)
  const childRouteId = computed(() => route.value.query.id)

  const resolveChildId = () => {
    const Child = useChild({ store })
    // Check if child id exists in route, if so use that value
    if (typeof childRouteId.value === 'string' || typeof childRouteId.value === 'number') {
      childId.value = parseInt(childRouteId.value)
      return
    }
    // If no child in route is present, use the current children id
    if (Child.currentChildren.value && Child.currentChildren.value.length > 0) {
      childId.value = Child.currentChildren.value[0].id
      return
    }

    childId.value = null
  }

  const { getTutorialQueryParams } = useTutorialQuery({ route, router })
  const setCurrentChildToRoute = (id: number) => {
    if (id && route.value.name) {
      // Update received child id in the store
      const child = store.getters['children/rows'].find(({ id: foundId }: Child) => foundId === id)

      if (child) {
        store.dispatch('setChild', { value: [child], save: true })
      }
      // Update route with updated child id
      if (shouldRedirect) {
        router.push({
          name: route.value.name,
          query: {
            id: `${id}`,
            ...getTutorialQueryParams()
          }
        } as unknown as RawLocation)
      }
    }
  }

  watch(childRouteId, () => {
    resolveChildId()
  }, { immediate: true })

  watch(childId, (val) => {
    if (val) {
      setCurrentChildToRoute(val)
    }
  }, { immediate: true })

  return {
    childId,
    resolveChildId,
    setCurrentChildToRoute
  }
}
