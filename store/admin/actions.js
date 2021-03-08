export default {
  async getVideosUploading ({ commit }) {
    try {
      const { data } = await this.$axios.get('/videos/uploading', {})
      commit('SET_UPLOADING_VIDEOS', data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
