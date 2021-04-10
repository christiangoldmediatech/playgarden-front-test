import { snotifyError } from '@/utils/vuex'

export default {
  async getMusicLibrariesByCurriculumType ({ commit }) {
    try {
      const musicLibraries = await this.$axios.$get('/music-library/by/curriculum')
      commit('SET_MUSIC_LIBRARIES', musicLibraries)
    } catch (err) {
      snotifyError(commit, {
        body: 'Sorry! There was an error while getting the music library.'
      })
    }
  }
}
