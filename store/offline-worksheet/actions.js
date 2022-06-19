export default {
  async upload({ dispatch }, { lessonId, childId, file }) {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await dispatch(
        'upload/doUpload',
        {
          type: 'upload-image',
          path: 'offline-worksheet',
          formData
        },
        { root: true }
      )

      const data = await this.$axios.$post('/worksheets/upload/lesson', {
        lessonId,
        childrenId: childId,
        url: response.filePath
      })

      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async getUploaded(ctx, childId) {
    const { data } = await this.$axios.get(`/worksheets/children/${childId}`)
    return data
  },

  async getRandomWorksheet(ctx) {
    const { data } = await this.$axios.get('/worksheets/random')
    return data
  },

  async getOfflineWorksheetsByChildren(ctx, { childId }) {
    try {
      const data = await this.$axios.$get(
        `worksheets/children/${childId}/by-lesson`
      )
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
