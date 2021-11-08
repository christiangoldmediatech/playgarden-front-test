import { TypedStore, Child } from '@/models'
import { useChild, useChildRoute, useStoreForAuth } from '@/composables'
import { computed, useRoute, useRouter, useStore } from '@nuxtjs/composition-api'
import { StudentChubbyItemText } from '~/components/app/student-cubby/types'
import { studentCubbyItems } from '~/components/app/student-cubby/constants'

export function usePlanAccessHelpers () {
  const store = useStore<TypedStore>()
  const { userInfo } = useStoreForAuth({ store })
  const route = useRoute()
  const router = useRouter()

  const { childId: studentId } = useChildRoute({ store, route, router })
  const { children } = useChild({ store })

  const currentChild = computed(() => children.value.find((child: Child) => child.id === studentId.value))

  const currrenPlanId = computed(() => userInfo.value?.planSelected.id)

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
