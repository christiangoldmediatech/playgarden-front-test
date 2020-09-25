import DashboardOverrides from './DashboardOverridesMixin.js'

export default {
  mixins: [DashboardOverrides],

  methods: {
    generateNuxtRoute (name, queryParams = {}) {
      let prefix = 'app-dashboard'
      let params

      if (this.lesson.previewMode) {
        prefix = 'admin-curriculum-management-lessonId-preview'
        params = { lessonId: this.$route.params.lessonId }
      }

      return {
        name: `${prefix}-${name}`,
        params,
        query: { ...this.overrides, ...queryParams }
      }
    }
  }
}
