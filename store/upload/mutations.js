const RESET_STATE = (state) => {}

export default {
  RESET_STATE,
  INCREMENT_ID: state => state.nextUploadId++,
  ADD_UPLOAD: (state, upload) => {
    state.uploads.push(upload)
  },
  SET_UPLOAD_PROGRESS: (state, { uploadId, progress }) => {
    const index = state.uploads.findIndex(({ id }) => id === uploadId)
    state.uploads[index].progress = progress
  },
  SET_UPLOAD_CANCEL: (state, { uploadId, cancel }) => {
    const index = state.uploads.findIndex(({ id }) => id === uploadId)
    state.uploads[index].cancel = cancel
  },
  REMOVE_UPLOAD: (state, uploadId) => {
    const index = state.uploads.findIndex(({ id }) => id === uploadId)
    state.uploads.splice(index, 1)
  }
}
