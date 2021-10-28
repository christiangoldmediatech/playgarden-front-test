import dayjs from 'dayjs'
import { Child } from '@/models'
import { computed, useStore } from '@nuxtjs/composition-api'

export function useBirthdayHelpers () {
  const store = useStore()

  const currentChild = computed((): Utils.Maybe<Child> => store.getters.getCurrentChild?.[0])

  const isCurrentChildsBirthday = computed((): boolean => {
    if (!currentChild.value) { return false }
    const { birthday } = currentChild.value
    const birthDate = dayjs(birthday)
    const today = dayjs()

    return (today.get('month') === birthDate.get('month')) && (today.get('date') === birthDate.get('date'))
  })

  return {
    isCurrentChildsBirthday,
    currentChild
  }
}
