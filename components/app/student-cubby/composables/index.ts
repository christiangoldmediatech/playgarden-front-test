import { TypedStore, Child } from '@/models'
import { useChild, useChildRoute } from '@/composables'
import { computed, useRoute, useRouter, useStore } from '@nuxtjs/composition-api'
import { StudentChubbyItemText } from '~/components/app/student-cubby/types'
import { studentCubbyItems } from '~/components/app/student-cubby/constants'

export function useStudentCubbyHelpers () {
  const store = useStore<TypedStore>()
  const route = useRoute()
  const router = useRouter()

  const { childId: studentId } = useChildRoute({ store, route, router })
  const { children } = useChild({ store })

  const currentChild = computed(() => children.value.find((child: Child) => child.id === studentId.value))

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
