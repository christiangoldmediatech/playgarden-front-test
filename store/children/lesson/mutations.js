import { set } from '@/utils/vuex'

export default {
  SET_CURRENT_LESSON_VIDEO: set('currentLessonVideo'),
  SET_CURRENT_LESSON_ID: set('currentLessonId'),
  SET_NEXT_LESSON_ID: set('nextLessonId'),
  SET_PREVIOUS_LESSON_ID: set('previousLessonId')
}
