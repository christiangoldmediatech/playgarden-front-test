export default {
  async getVideosUploading ({ commit }, params) {
    try {
      const { data } = await this.$axios.get('/videos', { params })
      console.log('data videos upload--', data)
      commit('SET_UPLOADING_VIDEOS', data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
