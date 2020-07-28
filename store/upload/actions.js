/* eslint-disable */
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
  },

  async doMultiPartBackgroundUpload ({ dispatch, commit }, { type, path, file, callback, meta }) {
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
      progress: 0,
      meta,
      cancel: () => { }
    }

    commit('ADD_UPLOAD', uploadProcess)

    dispatch('doChunks', { uploadId, file, key: data.urlKey, callback })
  
    return {
      uploadId,
      uploadUrl: data.urlKey
    }
  },

  async doChunks ({ state, commit }, { uploadId, file, key, callback }) {
    const Axios = this.$axios.create()
    delete Axios.defaults.headers.put['Content-Type']
    delete Axios.defaults.headers.common['Authorization']

    const uploadIndex = state.uploads.findIndex(({ id }) => id === uploadId)
    const upload = state.uploads[uploadIndex]
    const parts = upload.parts
    const etags = []

    try {
      for (const [partIndex, part] of parts.entries()) {

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
          }
        })
        
        // add etag
        etags.push({
          ETag: response.headers.etag,
          PartNumber: partIndex + 1
        })
      }

      // Complete upload
      await this.$axios.patch(`/files/video/complete/${uploadId}`, {
        key,
        parts: etags
      })

      // Do callback
      await callback()
    } catch (err) {
      if (err.response) {
        console.log(err.response.data)
      } else {
        console.log(err)
      }
    } finally {
      commit('REMOVE_UPLOAD', uploadId)
    }
  }
}
