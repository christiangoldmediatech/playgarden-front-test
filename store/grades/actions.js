import { snotifyError } from '@/utils/vuex'

export default {
  createGrade (_, data) {
    return this.$axios.$post('/grades', data)
  },

  deleteGrade (_, id) {
    return this.$axios.$delete(`/grades/${id}`)
  },

  getGrades ({ commit }, params) {
    return new Promise((resolve, reject) =>
      this.$axios
        .$get('/grades', { params })
        .then(resolve)
        .catch((error) => {
          snotifyError(commit, {
            body: 'Sorry! There was an error while getting Grades.'
          })
          // TO DO async away
          reject(error)
        })
    )
  },

  updateGrades (_, { id, data }) {
    return this.$axios.$patch(`/grades/${id}`, data)
  }
}
