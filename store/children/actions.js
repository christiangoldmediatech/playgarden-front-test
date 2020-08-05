export default {
  store ({ commit }, data) {
    return this.$axios.$post('/children', data)
  }
}
