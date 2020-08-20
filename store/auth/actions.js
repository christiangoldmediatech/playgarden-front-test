import jwtDecode from 'jwt-decode'
import { snotifyError } from '@/utils/vuex'
import { hasLocalStorage } from '@/utils/window'

export default {
  checkAuth ({ getters }) {
    let isLoggedIn = false
    if (getters.getAccessToken && getters.getExpiresAt) {
      if (new Date().getTime() < getters.getExpiresAt) {
        isLoggedIn = true
      }
    }

    return isLoggedIn
  },

  setToken ({ commit }, token) {
    const auth = jwtDecode(token)

    commit('SET_ACCESS_TOKEN', token)
    commit('SET_ISSUED_AT', auth.iat)
    commit('SET_EXPIRES_AT', auth.exp * 1000)

    if (hasLocalStorage()) {
      window.localStorage.setItem('authToken', JSON.stringify(token))
    }
  },

  logout ({ commit, rootGetters }, redirect) {
    commit('LOGOUT')

    if (hasLocalStorage()) {
      window.localStorage.removeItem('authToken')
    }

    // Only reset if we were logged in to begin with
    if (hasLocalStorage() && rootGetters.getCurrentChild) {
      commit('SET_CURRENT_CHILD', null, { root: true })
      commit('SET_CURRENT_CHILD_EXPIRES', null, { root: true })
      window.localStorage.removeItem('selectedChild')
    }

    if (redirect) {
      redirect({ name: 'index' })
    }
  },

  restoreAuthFromSessionStorage ({ dispatch }) {
    if (hasLocalStorage()) {
      const token = window.localStorage.getItem('authToken')

      if (token) {
        dispatch('setToken', JSON.parse(token))
      }
    }
  },

  async fetchUserInfo ({ commit }) {
    try {
      const { data } = await this.$axios.get('/auth/me')

      commit('SET_USER_INFO', data)

      return data
    } catch (error) {
      snotifyError(commit, {
        body: 'Sorry! There was an error while fetching user info!'
      })
    }
  },

  async updateUserInfo ({ commit }, draft) {
    try {
      const { data } = await this.$axios.patch('/auth/me/edit', draft)

      commit('SET_USER_INFO', data)

      return data
    } catch (error) {
      snotifyError(commit, {
        body: 'Sorry! There was an error while updating user info!'
      })
    }
  }
}
