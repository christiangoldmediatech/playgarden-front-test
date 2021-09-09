export default {
  async getChildrensProgress ({ commit }, params) {
    const data = await this.$axios.$get('/children/progress/list', { params })
    commit('SET_ROWS', data.children)
    commit('SET_FILTERED', data.filtered)
    commit('SET_LIMIT', data.limit)
    commit('SET_TOTAL', data.total)
    commit('SET_PAGE', data.page)
    return data
  }
}
