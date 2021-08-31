import { computed } from '@nuxtjs/composition-api'
import { Store } from 'vuex'

export const useChildren = ({ store }: { store: Store<unknown> }) => {
  // Store API Calls
  const getChildren = () => {
    return store.dispatch('children/get')
  }

  const userChildren = computed(() => {
    return store.getters['children/rows']
  })

  const selectChild = (childId: number) => {
    const child = userChildren.value.find((child: any) => child.id === childId)
    if (child) {
      store.dispatch('setChild', { value: [child], save: true })
    }
  }

  const selectedChildren = computed(() => {
    return store.getters.getCurrentChild
  })

  const currentChild = computed(() => {
    if (selectedChildren.value.length === 1) {
      return selectedChildren.value[0]
    }
    return undefined
  })

  return {
    getChildren,
    userChildren,
    selectChild,
    selectedChildren,
    currentChild
  }
}
