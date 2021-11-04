import { TypedStore, Child } from '@/models'
import { useChild, useChildRoute, useStoreForAuth } from '@/composables'
import { computed, useRoute, useRouter, useStore } from '@nuxtjs/composition-api'
import { StudentChubbyItemText, StudentCubbyItem } from '../types'
import { studentCubbyItems } from '../constants'

export function useStudentCubbyHelpers () {
  const store = useStore<TypedStore>()
  const { userInfo } = useStoreForAuth({ store })
  const route = useRoute()
  const router = useRouter()

  const { childId: studentId } = useChildRoute({ store, route, router })
  const { children } = useChild({ store })

  const currentChild = computed(() => children.value.find((child: Child) => child.id === studentId.value))

  const currrenPlanId = computed(() => userInfo.value?.planSelected.id)

  function getStudentChubbyItemFromItemText (itemText: string) {
    return studentCubbyItems.find(item => item.text === itemText)
  }

  function getItemDescription (itemText: StudentChubbyItemText | undefined) {
    const currentItem = studentCubbyItems.find(item => item.text === itemText)
    if (!currentItem) { return null }
    return typeof currentItem.description === 'string' ? currentItem.description : currentItem.description(currentChild.value?.firstName)
  }

  function isItemUnAvailableForCurrentUser (itemText: StudentChubbyItemText | undefined) {
    if (!currrenPlanId.value || !itemText) { return false }
    return studentCubbyItems.find(item => item.title === itemText)?.blockedPlanIds.includes(currrenPlanId.value)
  }

  function displayPlanUpgradeModal () {
    store.commit('notifications/SET_PLAN_UPGRADE_MODAL_VISIBILITY', true)
  }

  return {
    isItemUnAvailableForCurrentUser,
    getItemDescription,
    getStudentChubbyItemFromItemText,
    currentChild,
    displayPlanUpgradeModal
  }
}
