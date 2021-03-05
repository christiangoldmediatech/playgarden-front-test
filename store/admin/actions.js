export default {
  async getVideosUploading ({ commit }, params) {
    try {
      const { data } = await this.$axios.get('/videos', { params })
      commit('SET_UPLOADING_VIDEOS', data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
