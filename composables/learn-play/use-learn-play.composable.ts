import { Child, Lesson, TypedStore } from '@/models'
import { Store } from 'vuex/types'

export const useLearnPlay = ({ store }: { store: Store<TypedStore> }) => {
  const lesson: Lesson = store.getters['children/lesson/getCurrentLessonId']
  const currentChild: Child[] = store.getters.getCurrentChild

  return {
    lesson,
    currentChild
  }
}
