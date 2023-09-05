export default {
  async fetchLanguages ({ commit }) {
    try {
      const data = await this.$axios.$get('/languages')

      const formattedData = data.map((language) => {
        if (language.language === 'English') {
          return { ...language, icon: require('@/assets/svg/languages/english.svg') }
        }

        if (language.language === 'Spanish') {
          return { ...language, icon: require('@/assets/svg/languages/spanish.svg') }
        }

        return language
      })

      commit('SET_LANGUAGES', formattedData)
    } catch (e) {
      Promise.reject(e)
    }
  },

  async setUserLanguage(_, languageId) {
    try {
      const data = await this.$axios.$patch('/users/language', { languageId })
      return data
    } catch (e) {
      Promise.reject(e)
    }
  }
}
