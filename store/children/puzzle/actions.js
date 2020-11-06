export default {
  getPuzzleByChildId (_, { id }) {
    return this.$axios.$get(`/children/${id}/puzzle`)
  },

  getPuzzleActiveByChildId (_, { id }) {
    return this.$axios.$get(`/puzzle-children/children/${id}/active`)
  },

  findPuzzlesByChildrenId (_, { id }) {
    return this.$axios.$get(`/puzzle-children/children/${id}`)
  }
}
