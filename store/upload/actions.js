export default {
  async doUpload (ctx, { type, path, formData }) {
    const { data } = await this.$axios.post(`/files/${type}/${path}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return data
  }
}
