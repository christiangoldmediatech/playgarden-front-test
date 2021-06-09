export default {
  /*
   * LESSONS
   */
  createLesson (_, data) {
    return this.$axios.$post('/lessons', data)
  },

  deleteLesson (_, id) {
    return this.$axios.$delete(`/lessons/${id}`)
  },

  async getLessonById ({ commit }, id) {
    const data = await this.$axios.$get(`/lessons/${id}`)

    commit('SET_LESSON', data)

    return data
  },

  fetchLessons (_, params) {
    return this.$axios.$get('/lessons', { params })
  },

  updateLesson (_, { id, data }) {
    return this.$axios.$patch(`/lessons/${id}`, data)
  },

  /*
   * TYPES
   */
  async getTypes ({ commit }, name = null) {
    const data = await this.$axios.$get('/curriculum-types', {
      params: { name }
    })
    commit('SET_TYPES', data)
    return data
  },

  async createType (ctx, data) {
    await this.$axios.$post('/curriculum-types', data)
  },

  async updateType (ctx, { id, data }) {
    await this.$axios.$patch(`/curriculum-types/${id}`, data)
  },

  async deleteType (ctx, id) {
    await this.$axios.$delete(`/curriculum-types/${id}`)
  }
}
