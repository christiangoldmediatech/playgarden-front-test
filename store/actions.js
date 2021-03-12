import { hasLocalStorage } from '@/utils/window'

export default {
  disableAxiosGlobal: ({ commit }, { autoEnableIn = 30 } = {}) => {
    commit('DISABLE_AXIOS_GLOBAL_ERROR_HANDLER')

    if (autoEnableIn) {
      setTimeout(
        () => commit('ENABLE_AXIOS_GLOBAL_ERROR_HANDLER'),
        autoEnableIn * 1000
      )
    }
  },

  enableAxiosGlobal: ({ commit }) => {
    commit('ENABLE_AXIOS_GLOBAL_ERROR_HANDLER')
  },

  setChild ({ commit }, { value, oldExp = null, save = false }) {
    commit('SET_CURRENT_CHILD', value)

    const moment = new Date()
    moment.setHours(23)
    moment.setMinutes(59)
    moment.setSeconds(59)
    moment.setMilliseconds(999)

    const expires = oldExp || moment.getTime()
    commit('SET_CURRENT_CHILD_EXPIRES', expires)

    if (hasLocalStorage() && save) {
      let data
      if (Array.isArray(value)) {
        data = value.map(({ id }) => id)
      } else {
        data = value.id
      }

      window.localStorage.setItem(
        'selectedChild',
        JSON.stringify({
          value: data,
          expires
        })
      )
    }

    if (process.client && save) {
      let data
      if (Array.isArray(value)) {
        data = value.map(({ id }) => id)
      } else {
        data = value.id
      }

      this.$cookies.remove('selectedChild')
      this.$cookies.add({
        _key: 'selectedChild',
        _data: encodeURIComponent(JSON.stringify({
          value: data,
          expires
        })),
        _expireDate: new Date(expires).toISOString()
      })
    }
  },

  resetCurrentChild ({ commit }) {
    commit('SET_CURRENT_CHILD', null)
    commit('SET_CURRENT_CHILD_EXPIRES', null)

    if (process.client) {
      this.$cookies.remove('selectedChild')
    }

    if (hasLocalStorage() && window.localStorage.getItem('selectedChild')) {
      window.localStorage.removeItem('selectedChild')
    }
  }
}
