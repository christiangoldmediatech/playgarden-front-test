export default {
  computed: {
    overrides () {
      return {
        childId: this.$route.query.childId,
        lessonId: this.$route.query.lessonId
      }
    }
  }
}
