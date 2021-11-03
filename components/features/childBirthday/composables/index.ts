import dayjs, { Dayjs } from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import { Child } from '@/models'
import { computed, useStore } from '@nuxtjs/composition-api'
import { hasLocalStorage } from '@/utils/window'
dayjs.extend(isToday)

const LOCAL_STORAGE_KEY_FOR_WISHES_DATA = 'birthDayWishSeenStatus'
type BirthDayWishSeenData = { childId: number; lastClosedTime: string | Date }

export function useBirthdayHelpers () {
  const store = useStore()

  const currentChild = computed((): Utils.Maybe<Child> => store.getters.getCurrentChild?.[0])

  const isCurrentChildsBirthday = computed((): boolean => {
    if (!currentChild.value) { return false }
    const { birthday } = currentChild.value
    return isDateFallingToday(birthday)
  })

  function isDateFallingToday (date: string | Date | Dayjs) {
    return dayjs(date).format('DD/MM') === dayjs().format('DD/MM')
  }

  function setDialogClosedDataInLSForChild (childId: number | undefined) {
    if (!childId || !hasLocalStorage()) { return }
    const currentChildDataToBeSet = {
      childId,
      lastClosedTime: new Date()
    }
    const dataFromLS = getDialogClosedDataFromLS()
    if (dataFromLS) {
      const currentChildDataIndex = dataFromLS.findIndex(data => data.childId === currentChild.value?.id)

      if (currentChildDataIndex > -1) {
        dataFromLS[currentChildDataIndex] = currentChildDataToBeSet
      } else {
        dataFromLS.push(currentChildDataToBeSet)
      }
      window.localStorage.setItem(LOCAL_STORAGE_KEY_FOR_WISHES_DATA, JSON.stringify(dataFromLS))
    } else {
      window.localStorage.setItem(LOCAL_STORAGE_KEY_FOR_WISHES_DATA, JSON.stringify([currentChildDataToBeSet]))
    }
  }

  function getDialogClosedDataFromLS () {
    if (hasLocalStorage()) {
      const LSValue = window.localStorage.getItem(LOCAL_STORAGE_KEY_FOR_WISHES_DATA)
      return typeof LSValue === 'string' ? JSON.parse(LSValue) as BirthDayWishSeenData[] : null
    }
  }

  return {
    isCurrentChildsBirthday,
    currentChild,
    isDateFallingToday,
    setDialogClosedDataInLSForChild,
    getDialogClosedDataFromLS
  }
}
