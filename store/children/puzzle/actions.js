export default {
  getPuzzleByChildId (_, { id }) {
    return this.$axios.$get(`/children/${id}/puzzle`)
  }
}
