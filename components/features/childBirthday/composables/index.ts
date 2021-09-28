import { Child } from '@/models'
import { computed, useStore } from '@nuxtjs/composition-api'

export function useBirthdayHelpers () {
  const store = useStore()

  const currentChild = computed((): Utils.Maybe<Child> => store.getters.getCurrentChild?.[0])

  const isCurrentChildsBirthday = computed((): boolean => {
    if (!currentChild.value) { return false }
    const { birthday } = currentChild.value
    const birthDate = new Date(birthday)
    const today = new Date()
    return (
      today.getDate() === birthDate.getDate() &&
      today.getMonth() === birthDate.getMonth()
    )
  })

  return {
    isCurrentChildsBirthday,
    currentChild
  }
}
