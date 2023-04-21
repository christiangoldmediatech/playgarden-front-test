import { actionTree } from 'typed-vuex'
import jwtDecode from 'jwt-decode'
import { toastError } from '@/utils/vuex'
import { hasLocalStorage } from '@/utils/window'
import { User } from '@/composables/users/types'
import { state, mutations, getters } from './'

export default actionTree(
  { state, mutations, getters },
  {
    checkAuth({ getters }) {
      let isLoggedIn = false

      if (getters.getAccessToken && getters.getExpiresAt) {
        if (new Date().getTime() < getters.getExpiresAt) {
          isLoggedIn = true
        }
      }

      return isLoggedIn
    },

    setToken({ commit }, token) {
      if (token && token !== 'removed') {
        const auth = jwtDecode<{ exp: number; iat: number }>(token)

        if (process.client && token) {
          this.$cookies.remove('atoken')
          this.$cookies.add({ _key: 'atoken', _data: token, _maxAge: auth.exp })
        }

        commit('SET_ACCESS_TOKEN', token)
        commit('SET_ISSUED_AT', auth.iat)
        commit('SET_EXPIRES_AT', auth.exp * 1000)
        this.$axios.setToken(token, 'Bearer')

        if (hasLocalStorage()) {
          window.localStorage.setItem('authToken', JSON.stringify(token))
        }
      }
    },

    setPlaydateInvitationToken({ commit }, token = null) {
      commit('SET_PLAYDATE_INVITATION_TOKEN', token)
    },

    cleanChildren(): void {
      const store = this.app.$accessor
      store.SET_CURRENT_CHILD(null)
      store.SET_CURRENT_CHILD_EXPIRES(null)
    },

    /**
     *
     * @param { Object }  - {redirect: Function, route: String}
     */
    logout({ commit }, redirectOptions): void {
      const store = this.app.$accessor

      commit('LOGOUT')
      this.$axios.setToken('', 'Bearer')

      if (process.client) {
        this.$cookies.remove('atoken')
      }

      if (hasLocalStorage()) {
        window.localStorage.removeItem('authToken')
        // Resets child selection.
        if (store.getCurrentChild) {
          window.localStorage.removeItem('selectedChild')
        }
      }

      if (store.getCurrentChild) {
        store.SET_CURRENT_CHILD(null)
        store.SET_CURRENT_CHILD_EXPIRES(null)
      }

      if (store.notifications.notificationCard.isVisible) {
        store.notifications.SET_NOTIFICATION_CARD({ isVisible: false })
      }

      if (store.notifications.isTrialExpiringRibbonVisible) {
        store.notifications.SET_TRIAL_EXPIRING_RIBBON_VISIBLE(false)
      }

      if (
        redirectOptions &&
        typeof redirectOptions === 'object' &&
        Object.prototype.hasOwnProperty.call(redirectOptions, 'redirect')
      ) {
        if (Object.prototype.hasOwnProperty.call(redirectOptions, 'route')) {
          redirectOptions.redirect({
            name: 'index',
            query: { redirect: encodeURIComponent(redirectOptions.route) }
          })
        } else {
          redirectOptions.redirect({ name: 'index' })
        }
      }
    },

    restoreAuthFromSessionStorage({ dispatch }) {
      if (hasLocalStorage()) {
        const token = window.localStorage.getItem('authToken')

        if (token) {
          dispatch('setToken', JSON.parse(token))
        }
      }
    },

    async fetchUserInfo({ commit, rootGetters }): Promise<User | undefined> {
      try {
        const { data } = await this.$axios.get('/auth/me', {})
        commit('SET_USER_INFO', data)
        return data
      } catch (error) {
        if (!rootGetters.isDisabledAxiosGlobalErrorHandler) {
          toastError(commit, {
            body: 'Sorry! There was an error while fetching user info!'
          })
        }
      }
    },

    async updateUserInfo({ commit, dispatch }, draft) {
      try {
        const { data } = await this.$axios.patch('/auth/me/edit', draft)
        commit('SET_USER_INFO', data.user)
        if (data.accessToken) {
          dispatch('auth/setToken', data.accessToken, { root: true })
        }
        return data.user
      } catch (error) {
        toastError(commit, {
          body: 'Sorry! There was an error while updating user info!'
        })
      }
    },

    async updateAuthOnboarding({ dispatch }) {
      await this.$axios.patch('/auth/onboarding')

      return dispatch('fetchUserInfo')
    },

    async setPlanChoosen (): Promise<void> {
      await this.$axios.$get('/users/plan/choosen')
    }
  }
)
