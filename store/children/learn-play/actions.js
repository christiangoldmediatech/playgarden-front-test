import { toastError } from '@/utils/vuex'

export default {
  getFirstLearnPlay ({ commit, rootGetters }, params) {
    const childId = rootGetters.getCurrentChild[0].id
    return new Promise((resolve, reject) =>
      this.$axios
        .$get(`/play-and-learn/by-child/${childId}`, { params })
        .then(resolve)
        .catch((error) => {
          toastError(commit, {
            body: 'Sorry! There was an error while getting learn-play.'
          })
          // TO DO async away
          reject(error)
        })
    )
  },
  getPlayAndLearnByCurriculumTypeId({ commit }, params) {
    return new Promise((resolve, reject) =>
      this.$axios
        .$get(`/play-and-learn/curriculum-type/${params.curriculumTypeId}`)
        .then(resolve)
        .catch((error) => {
          toastError(commit, {
            body: 'Sorry! There was an error while getting learn-play.'
          })
          // TO DO async away
          reject(error)
        })
    )
  },
  getPlayAndLearnInfoByCurriculumTypeId({ commit }, params) {
    return new Promise((resolve, reject) =>
      this.$axios
        .$get(`/play-and-learn/curriculum-type/${params.curriculumTypeId}/info`)
        .then(resolve)
        .catch((error) => {
          toastError(commit, {
            body: 'Sorry! There was an error while getting learn-play.'
          })
          // TO DO async away
          reject(error)
        })
    )
  },
  getPlayAndLearnVideosByCurriculumTypeId({ commit }, params) {
    return new Promise((resolve, reject) =>
      this.$axios
        .$get(`/play-and-learn/curriculum-type/${params.curriculumTypeId}/videos`)
        .then(resolve)
        .catch((error) => {
          toastError(commit, {
            body: 'Sorry! There was an error while getting learn-play videos.'
          })
          // TO DO async away
          reject(error)
        })
    )
  },
  getPlayAndLearnSongsByCurriculumTypeId({ commit }, params) {
    return new Promise((resolve, reject) =>
      this.$axios
        .$get(`/play-and-learn/curriculum-type/${params.curriculumTypeId}/songs`)
        .then(resolve)
        .catch((error) => {
          toastError(commit, {
            body: 'Sorry! There was an error while getting learn-play songs.'
          })
          // TO DO async away
          reject(error)
        })
    )
  },
  getPlayAndLearnFilesByCurriculumTypeId({ commit }, params) {
    return new Promise((resolve, reject) =>
      this.$axios
        .$get(`/play-and-learn/curriculum-type/${params.curriculumTypeId}/files`)
        .then(resolve)
        .catch((error) => {
          toastError(commit, {
            body: 'Sorry! There was an error while getting learn-play files.'
          })
          // TO DO async away
          reject(error)
        })
    )
  },
  getPlayAndLearnWorksheetsByCurriculumTypeId({ commit }, params) {
    return new Promise((resolve, reject) =>
      this.$axios
        .$get(`/play-and-learn/curriculum-type/${params.curriculumTypeId}/worksheets`)
        .then(resolve)
        .catch((error) => {
          toastError(commit, {
            body: 'Sorry! There was an error while getting learn-play worksheets.'
          })
          // TO DO async away
          reject(error)
        })
    )
  },
  getPlayAndLearnBooksByCurriculumTypeId({ commit }, params) {
    return new Promise((resolve, reject) =>
      this.$axios
        .$get(`/play-and-learn/curriculum-type/${params.curriculumTypeId}/books`)
        .then(resolve)
        .catch((error) => {
          toastError(commit, {
            body: 'Sorry! There was an error while getting learn-play books.'
          })
          // TO DO async away
          reject(error)
        })
    )
  }
}
