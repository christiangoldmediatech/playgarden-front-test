import { set } from '@/utils/vuex'

export default {
  SET_CURRENT_LESSON_VIDEO: set('currentLessonVideo'),
  SET_CHILDREN_PROGRESS: set('childrenProgress'),
  RESET (state) {
    state.currentLessonVideo = null
    state.childrenProgress = []
  }
}
