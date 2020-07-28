export default {
  /*
   * LESSONS
   */
  createLesson (_, data) {
    return new Promise((resolve, reject) =>
      this.$axios
        .post('/lessons', data)
        .then(({ data }) => resolve(data))
        .catch(reject)
    )
  },

  deleteLesson (_, id) {
    return new Promise((resolve, reject) =>
      this.$axios
        .delete(`/lessons/${id}`)
        .then(resolve)
        .catch(reject)
    )
  },

  getLessonById (_, id) {
    return new Promise((resolve, reject) =>
      this.$axios
        .get(`/lessons/${id}`)
        .then(({ data }) => resolve(data))
        .catch(reject)
    )
  },

  fetchLessons (_, params) {
    return new Promise((resolve, reject) =>
      this.$axios
        .get('/lessons', { params })
        .then(({ data }) => resolve(data))
        .catch(reject)
    )
  },

  updateLesson (_, { id, data }) {
    return new Promise((resolve, reject) =>
      this.$axios
        .patch(`/lessons/${id}`, data)
        .then(({ data }) => resolve(data))
        .catch(reject)
    )
  },

  fetchVideosByLessonId (_, { id, params }) {
    return new Promise((resolve, reject) =>
      this.$axios
        .get(`/lessons/${id}/videos`, { params })
        .then(({ data }) => resolve(data))
        .catch(reject)
    )
  },

  /*
   * TYPES
   */
  async getTypes ({ commit }, name = null) {
    const data = await this.$axios.$get('/curriculum-types', {
      params: { name }
    })
    commit('SET_TYPES', data)
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
