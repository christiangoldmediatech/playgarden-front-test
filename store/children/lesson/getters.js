export default {
  getCurrentLessonVideo: state => state.currentLessonVideo || {},
  getCurrentLessonId: state => state.currentLessonId,
  getNextLessonId: state => state.nextLessonId,
  getPreviousLessonId: state => state.previousLessonId
}
