const RESET_STATE = (state) => {}

export default {
  RESET_STATE,

  INCREMENT_ID: state => state.nextUploadId++,

  ADD_UPLOAD: (state, upload) => {
    state.uploads.push(upload)
  },

  ADD_UPLOAD_PART: (state, { uploadId, part }) => {
    const index = state.uploads.findIndex(({ id }) => id === uploadId)
    if (index >= 0) {
      state.uploads[index].parts.push(part)
    }
  },

  SET_UPLOAD_STATUS: (state, { uploadId, status }) => {
    const index = state.uploads.findIndex(({ id }) => id === uploadId)
    state.uploads[index].status = status
  },

  SET_UPLOAD_ACTIVE_PART_INDEX: (state, { uploadId, partIndex }) => {
    const index = state.uploads.findIndex(({ id }) => id === uploadId)
    state.uploads[index].activePartIndex = partIndex
  },

  SET_UPLOAD_PROGRESS: (state, { uploadId, progress }) => {
    const index = state.uploads.findIndex(({ id }) => id === uploadId)
    state.uploads[index].progress = progress
  },

  SET_UPLOAD_PART_PROGRESS: (state, { uploadId, partIndex, progress }) => {
    const index = state.uploads.findIndex(({ id }) => id === uploadId)
    if (index >= 0) {
      state.uploads[index].parts[partIndex].progress = progress
    }
  },

  SET_UPLOAD_PART_CANCEL_TOKEN: (state, { uploadId, partIndex, cancelToken }) => {
    const index = state.uploads.findIndex(({ id }) => id === uploadId)
    state.uploads[index].parts[partIndex].cancelToken = cancelToken
  },

  SET_UPLOAD_CANCEL_TOKEN: (state, { uploadId, cancelToken }) => {
    const index = state.uploads.findIndex(({ id }) => id === uploadId)
    state.uploads[index].cancelToken = cancelToken
  },

  REMOVE_UPLOAD: (state, uploadId) => {
    const index = state.uploads.findIndex(({ id }) => id === uploadId)
    if (index >= 0) {
      state.uploads.splice(index, 1)
    }
  }
}
