import jwtDecode from 'jwt-decode'
import { hasSessionStorage } from '@/utils/window'

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

    if (hasSessionStorage()) {
      window.sessionStorage.setItem('authToken', JSON.stringify(token))
    }
  },

  logout ({ commit, getters }, redirect) {
    commit('LOGOUT')

    if (hasSessionStorage()) {
      window.sessionStorage.removeItem('authToken')
    }

    if (redirect) {
      redirect({ name: 'index' })
    }
  },

  restoreAuthFromSessionStorage ({ dispatch }) {
    if (hasSessionStorage()) {
      const token = window.sessionStorage.getItem('authToken')

      if (token) {
        dispatch('setToken', JSON.parse(token))
      }
    }
  }
}
