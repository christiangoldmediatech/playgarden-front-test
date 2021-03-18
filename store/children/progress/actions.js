export default {
  getChildrenProgress () {
    return this.$axios.get('/children/progress/list')
  },

  getChildrenProgressExport () {
    return this.$axios.get('/children/progress/export')
  },

  async getUserChildrenProgress () {
    const response = await this.$axios.get('/children?progress=1')

    return response.data
  }
}
