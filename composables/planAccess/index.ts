import { TypedStore, Child } from '@/models'
import { useChild, useChildRoute, useStoreForAuth } from '@/composables'
import { computed, useRoute, useRouter } from '@nuxtjs/composition-api'
import { Store } from 'vuex/types'
import { StudentChubbyItemText } from '~/components/app/student-cubby/types'
import { studentCubbyItems } from '~/components/app/student-cubby/constants'

interface UsePlanAccessParams {
  store: Store<TypedStore>,
  route: ReturnType<typeof useRoute>
  router: ReturnType<typeof useRouter>
}

export const usePlanAccessHelpers = ({ store, route, router }: UsePlanAccessParams) => {
  const StoreForAuth = useStoreForAuth({ store })
  const ChildRoute = useChildRoute({ store, route, router })
  const Child = useChild({ store })

  const currentChild = computed(() => Child.children.value.find((child: Child) => child.id === ChildRoute.childId.value))
  const currrenPlanId = computed(() => StoreForAuth.userInfo.value?.planSelected.id)
  const isCurrentLessonUnavailableInPlan = computed(() => store.state.children.lesson.isCurrentLessonUnavailableInPlan)

  function isItemUnAvailableForCurrentUser (itemText: StudentChubbyItemText | undefined) {
    if (!currrenPlanId.value || !itemText) { return false }
    return studentCubbyItems.find(item => item.title === itemText)?.blockedPlanIds.includes(currrenPlanId.value)
  }

  function displayPlanUpgradeModal () {
    store.commit('notifications/SET_PLAN_UPGRADE_MODAL_VISIBILITY', true)
  }

  return {
    isItemUnAvailableForCurrentUser,
    currentChild,
    displayPlanUpgradeModal,
    isCurrentLessonUnavailableInPlan
  }
}
