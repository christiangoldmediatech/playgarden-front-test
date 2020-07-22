export default {
  async doUpload (ctx, { type, path, formData }) {
    const { data } = await this.$axios.post(`/files/${type}/${path}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return data
  },

  doBackgroundUpload ({ state, commit }, { type, path, name, formData, callback, meta }) {
    // Create a background upload process
    const uploadId = state.nextUploadId
    commit('INCREMENT_ID')

    const uploadProcess = {
      id: uploadId,
      name,
      progress: 0,
      meta,
      cancel: () => {}
    }

    commit('ADD_UPLOAD', uploadProcess)

    // Handle request
    this.$axios.post(`/files/${type}/${path}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const progress = ((progressEvent.loaded * 100) / progressEvent.total).toFixed(2)
        commit('SET_UPLOAD_PROGRESS', { uploadId, progress })
      },
      cancelToken: new this.$axios.CancelToken(function executor (cancel) {
        commit('SET_UPLOAD_CANCEL', { uploadId, cancel })
      })
    }).then(({ data }) => {
      callback(data).then(() => {
        commit('REMOVE_UPLOAD', uploadId)
      })
    }).catch(() => {
      commit('REMOVE_UPLOAD', uploadId)
    })

    return true
  }
}
