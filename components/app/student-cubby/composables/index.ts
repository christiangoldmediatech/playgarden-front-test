import { TypedStore, Child } from '@/models'
import { useChild, useChildRoute } from '@/composables'
import { computed, useRoute, useRouter } from '@nuxtjs/composition-api'
import { Store } from 'vuex/types'
import { StudentChubbyItemText } from '~/components/app/student-cubby/types'
import { studentCubbyItems } from '~/components/app/student-cubby/constants'

interface UseChildRouteParams {
  store: Store<TypedStore>,
  route: ReturnType<typeof useRoute>
  router: ReturnType<typeof useRouter>
}

export const useStudentCubbyHelpers = ({ store, route, router } : UseChildRouteParams) => {
  const ChildRoute = useChildRoute({ store, route, router })
  const Child = useChild({ store })

  const currentChild = computed(() => Child.children.value.find((child: Child) => child.id === ChildRoute.childId.value))

  function getStudentChubbyItemFromItemText (itemText: string) {
    return studentCubbyItems.find(item => item.text === itemText)
  }

  function getItemDescription (itemText: StudentChubbyItemText | undefined) {
    const currentItem = studentCubbyItems.find(item => item.text === itemText)
    if (!currentItem) { return null }
    return typeof currentItem.description === 'string' ? currentItem.description : currentItem.description(currentChild.value?.firstName)
  }

  return {
    getItemDescription,
    getStudentChubbyItemFromItemText,
    currentChild
  }
}
