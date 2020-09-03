export default {
  async upload ({ dispatch }, { lessonId, childrenId, categoryId, File }) {
    try {
      const formData = new FormData()
      formData.append('file', File)

      const response = await dispatch('upload/doUpload', {
        type: 'upload-document',
        path: 'offline-worksheet',
        formData
      }, { root: true })

      const data = await this.$axios.$post('/worksheets/upload', {
        lessonId,
        childrenId,
        categoryId,
        url: response.filePath
      })

      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async getUploaded (ctx, childId) {
    const { data } = await this.$axios.get(`/worksheets/children/${childId}`)
    return data
  }
}
