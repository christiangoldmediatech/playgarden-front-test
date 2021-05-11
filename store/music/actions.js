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
  },

  setFavoriteMusicForChild (_, { childId, musicId }) {
    return this.$axios.$post('/music-favorites', { childrenId: childId, musicId })
  },

  removeFavoriteMusic (_, musicId) {
    return this.$axios.$delete(`/music-favorites/${musicId}`)
  },

  async getFavoriteMusicForChild (_, childId) {
    const favorites = await this.$axios.$get(`/music-favorites/children/${childId}`)

    return favorites
  },

  sendCurrentPlayingMusic (_, { musicId, childId }) {
    return this.$axios.post(`/music-library/${musicId}/children/${childId}`)
  }
}
