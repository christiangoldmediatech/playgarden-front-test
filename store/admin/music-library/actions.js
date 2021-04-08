export default {

  async get ({ commit }, params) {
    const data = await this.$axios.$get('/music-library', { params })
    commit('SET_MUSIC_LIBRARIES', data.musicLibrary)
    commit('SET_FILTERED', data.filtered)
    commit('SET_LIMIT', data.limit)
    commit('SET_TOTAL', data.total)
    commit('SET_PAGE', data.page)
  },

  async getById (ctx, id) {
    const data = await this.$axios.$get(`/music-library/${id}`)
    return data
  },

  createMusicLibrary (_, data) {
    return this.$axios.$post('music-library', data)
  },

  delete (_, id) {
    return this.$axios.$delete(`music-library/${id}`)
  },

  updateMusicLibrary (_, { id, data }) {
    return this.$axios.$patch(`music-library/${id}`, data)
  }
}
