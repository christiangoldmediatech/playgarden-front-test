export default {
  getCurrentLessonVideo: state => state.currentLessonVideo || {},
  getCurrentLessonId: state => state.currentLessonId,
  getCurrentLessonInState: state => state.currentLesson,
  getNextLessonId: state => state.nextLessonId,
  getPreviousLessonId: state => state.previousLessonId
}
