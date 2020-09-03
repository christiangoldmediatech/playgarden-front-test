export default {
  getPatchesByChildId (_, { id }) {
    return this.$axios.$get(`/children/${id}/patches`)
  }
}
