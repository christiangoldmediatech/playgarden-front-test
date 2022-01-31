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
    if (token && token !== 'removed') {
      const auth = jwtDecode(token)

      if (process.client && token) {
        this.$cookies.remove('atoken')
        this.$cookies.add({ _key: 'atoken', _data: token, _maxAge: auth.exp })
      }

      commit('SET_ACCESS_TOKEN', token)
      commit('SET_AXIOS_TOKEN', token)
      commit('SET_ISSUED_AT', auth.iat)
      commit('SET_EXPIRES_AT', auth.exp * 1000)

      if (hasLocalStorage()) {
        window.localStorage.setItem('authToken', JSON.stringify(token))
      }
    }
  },

  setPlaydateInvitationToken ({ commit }, token = null) {
    commit('SET_PLAYDATE_INVITATION_TOKEN', token)
  },

  /**
   *
   * @param { Object }  - {redirect: Function, route: String}
   */
  logout ({ commit, rootGetters, rootState }, redirectOptions) {
    commit('LOGOUT')

    if (process.client) {
      this.$cookies.remove('atoken')
    }

    if (hasLocalStorage()) {
      window.localStorage.removeItem('authToken')
      // Resets child selection.
      if (rootGetters.getCurrentChild) {
        window.localStorage.removeItem('selectedChild')
      }
    }

    if (rootGetters.getCurrentChild) {
      commit('SET_CURRENT_CHILD', null, { root: true })
      commit('SET_CURRENT_CHILD_EXPIRES', null, { root: true })
    }

    if (rootState.notifications.notificationCard.isVisible) {
      commit('notifications/SET_NOTIFICATION_CARD', {
        isVisible: false
      }, { root: true })
    }

    if (rootState.notifications.isTrialExpiringRibbonVisible) {
      commit('notifications/SET_TRIAL_EXPIRING_RIBBON_VISIBLE', false, { root: true })
    }

    if (redirectOptions &&
        typeof redirectOptions === 'object' &&
        Object.prototype.hasOwnProperty.call(redirectOptions, 'redirect')
    ) {
      if (Object.prototype.hasOwnProperty.call(redirectOptions, 'route')) {
        redirectOptions.redirect({ name: 'index', query: { redirect: encodeURIComponent(redirectOptions.route) } })
      } else {
        redirectOptions.redirect({ name: 'index' })
      }
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

  async fetchUserInfo ({ commit, rootGetters }) {
    try {
      const { data } = await this.$axios.get('/auth/me', { })
      commit('SET_USER_INFO', data)
      return data
    } catch (error) {
      if (!rootGetters.isDisabledAxiosGlobalErrorHandler) {
        snotifyError(commit, {
          body: 'Sorry! There was an error while fetching user info!'
        })
      }
    }
  },

  async updateUserInfo ({ commit, dispatch }, draft) {
    try {
      const { data } = await this.$axios.patch('/auth/me/edit', draft)
      commit('SET_USER_INFO', data.user)
      if (data.accessToken) {
        dispatch('auth/setToken', data.accessToken, { root: true })
      }
      return data.user
    } catch (error) {
      snotifyError(commit, {
        body: 'Sorry! There was an error while updating user info!'
      })
    }
  },

  async updateAuthOnboarding ({ dispatch }) {
    await this.$axios.patch('/auth/onboarding')

    return dispatch('fetchUserInfo')
  }
}
