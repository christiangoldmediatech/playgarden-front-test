export default {
  async doUpload (ctx, { type, path, formData }) {
    try {
      const { data } = await this.$axios.post(`/files/${type}/${path}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async doUploadJoinMultilpe (ctx, { type, path, formData }) {
    try {
      const { data } = await this.$axios.post(`/files/${type}/${path}/multiple`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async doUploadJoinMultilpeDropBox (ctx, { type, path, files }) {
    try {
      const { data } = await this.$axios.post(`/files/${type}/${path}/multiple`, { files }, {
      })
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async doMultiPartDropBoxUpload ({ state, commit }, dataFileDropBox) {
    const { data } = await this.$axios.post(`/files/${dataFileDropBox.type}/${dataFileDropBox.path}`, dataFileDropBox)
    return data
  },

  async doMultiPartBackgroundUpload ({ state, commit }, { type, mode, path, file, callback, meta }) {
    // Find number of file parts
    const FILE_CHUNK_SIZE = 10000000
    const FILE_SIZE = file.size
    const FILE_NAME = file.name
    const NUMBER_OF_CHUNKS = Math.ceil(FILE_SIZE / FILE_CHUNK_SIZE)

    const { data } = await this.$axios.post(`/files/${type}/${path}/${NUMBER_OF_CHUNKS}`)

    // Break file up into chunks
    const parts = []
    data.results.forEach((url, i) => {
      const start = i * FILE_CHUNK_SIZE
      const end = (start + FILE_CHUNK_SIZE > FILE_SIZE) ? FILE_SIZE : start + FILE_CHUNK_SIZE
      parts.push({
        url,
        start,
        end,
        progress: 0
      })
    })

    // Create a background upload process
    const uploadId = data.uploadId

    const uploadProcess = {
      id: uploadId,
      name: FILE_NAME,
      parts,
      activePartIndex: null,
      status: 'UPLOADING',
      progress: 0,
      meta,
      cancel: async () => {
        const upload = state.uploads.find(({ id }) => id === uploadId)
        const activePart = upload.parts[upload.activePartIndex]
        if (upload.status === 'UPLOADING' && activePart) {
          commit('SET_UPLOAD_STATUS', { uploadId, status: 'CANCELLING' })
          await activePart.cancelToken('UPLOAD_CANCELLED_BY_USER')
          await this.$axios.delete(`/files/${mode}/abort/${data.video.id}`, {
            data: {
              key: data.urlKey
            }
          })
        }
      }
    }

    commit('ADD_UPLOAD', uploadProcess)

    // Do chunks
    const doChunks = async () => {
      const Axios = this.$axios.create()
      delete Axios.defaults.headers.put['Content-Type']
      delete Axios.defaults.headers.common.Authorization

      const uploadIndex = state.uploads.findIndex(({ id }) => id === uploadId)
      const upload = state.uploads[uploadIndex]
      const parts = upload.parts
      const etags = []

      try {
        for (const [partIndex, part] of parts.entries()) {
          commit('SET_UPLOAD_ACTIVE_PART_INDEX', { uploadId, partIndex })
          const chunk = file.slice(part.start, part.end)
          const response = await Axios.put(part.url, chunk, {
            onUploadProgress: (progressEvent) => {
              const progress = ((progressEvent.loaded * 100) / progressEvent.total).toFixed(2)

              commit('SET_UPLOAD_PART_PROGRESS', { uploadId, partIndex, progress })

              // estimate overall progress
              const sum = parts.reduce((accumulator, entry) => {
                return accumulator + Number(entry.progress)
              }, 0)
              const completed = (sum / parts.length).toFixed(2)

              commit('SET_UPLOAD_PROGRESS', { uploadId, progress: completed })
            },

            cancelToken: new this.$axios.CancelToken(function executor (cancelToken) {
              commit('SET_UPLOAD_PART_CANCEL_TOKEN', { uploadId, partIndex, cancelToken })
            })
          })

          // add etag
          etags.push({
            ETag: response.headers.etag,
            PartNumber: partIndex + 1
          })
        }

        commit('SET_UPLOAD_STATUS', { uploadId, status: 'COMPLETING' })

        // Complete upload
        await this.$axios.patch(`/files/${mode}/complete/${data.video.id}`, {
          key: data.urlKey,
          parts: etags
        })

        // Do callback
        await callback()
      } catch (error) {
        if (error && error.message !== 'UPLOAD_CANCELLED_BY_USER') {
          await this.$axios.delete(`/files/${mode}/abort/${data.video.id}`, {
            data: {
              key: data.urlKey
            }
          })
          return Promise.reject(error)
        }
      } finally {
        commit('REMOVE_UPLOAD', uploadId)
      }
    }

    doChunks()

    return data
  }
}
