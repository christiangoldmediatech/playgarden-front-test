export default {
  async create (ctx, params) {
    try {
      const { data } = await this.$axios.post('/activities-analytics', params)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async getByChildId (ctx, { activityId, childId }) {
    try {
      const { data } = await this.$axios.get(`/activities-analytics/activity/${activityId}/children/${childId}`)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async update (ctx, { analyticsId, params }) {
    try {
      const { data } = await this.$axios.patch(`/activities-analytics/${analyticsId}`, params)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
