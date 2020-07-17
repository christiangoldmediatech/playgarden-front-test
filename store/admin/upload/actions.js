export default {
  async doUpload (ctx, { path, formData }) {
    const { data } = await this.$axios.post(`/files/upload-image/${path}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return data
  }
}
