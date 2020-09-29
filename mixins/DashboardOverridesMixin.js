export default {
  computed: {
    overrides () {
      const others = this.customOverrides || {}
      return {
        childId: this.$route.query.childId,
        lessonId: this.$route.query.lessonId,
        ...others
      }
    }
  }
}
