import { hasLocalStorage } from '@/utils/window'
import parentSubscriptionWhitelistedRoutes from '~/utils/consts/parentSubscriptionWhitelistedRoutes.json'
import unauthenticatedRoutes from '~/utils/consts/unauthenticatedRoutes.json'

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

  setChild({ commit }, { value, oldExp = null, save = false }) {
    if (value[0].everyone) {
      const valueEveryone = [
        { ...value[0], id: value[0].id, allIds: value[0].id }
      ]
      commit('SET_CURRENT_CHILD', valueEveryone)
    } else {
      commit('SET_CURRENT_CHILD', value)
    }

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

      /**
        * If the selected child is "everyone", the id will be an array. If so, let's add
        *  a flag to the localStorage `selectedChild` key.
      */

      let everyone = false
      if (Array.isArray(data) && data[0].length > 0) {
        data = data[0]
        everyone = true
      }

      window.localStorage.setItem(
        'selectedChild',
        JSON.stringify({
          value: data,
          expires,
          everyone
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

      let everyone = false
      if (Array.isArray(data) && data[0].length > 0) {
        data = data[0]
        everyone = true
      }

      this.$cookies.remove('selectedChild')
      this.$cookies.add({
        _key: 'selectedChild',
        _data: encodeURIComponent(
          JSON.stringify({
            value: data,
            expires,
            everyone
          })
        ),
        _expireDate: new Date(expires).toISOString()
      })
    }
  },

  resetCurrentChild({ commit }) {
    commit('SET_CURRENT_CHILD', null)
    commit('SET_CURRENT_CHILD_EXPIRES', null)

    if (process.client) {
      this.$cookies.remove('selectedChild')
    }

    if (hasLocalStorage() && window.localStorage.getItem('selectedChild')) {
      window.localStorage.removeItem('selectedChild')
    }
  },

  async initApp({ dispatch }, { $route, $router }) {
    const isUnauthenticatedRoute = !!unauthenticatedRoutes[$route.name]
    let isLoggedIn = await dispatch('auth/checkAuth', undefined, { root: true })

    if (!isLoggedIn) {
      await dispatch('auth/restoreAuthFromSessionStorage', undefined, {
        root: true
      })
    }

    isLoggedIn = await dispatch('auth/checkAuth', undefined, { root: true })

    if (isLoggedIn) {
      await dispatch('auth/fetchUserInfo', undefined, { root: true })
      await dispatch('pickChild', { $route, $router }, { root: true })
    } else if (isUnauthenticatedRoute) {
      await dispatch('auth/logout', {}, { root: true })
    }
  },

  async pickChild ({ dispatch, getters }, { $router, $route, $cookies, req }) {
    const isAppRoute = /^app-.*$/.test($route.name)
    let child = getters.getCurrentChild
    let childExpires = getters.getCurrentChildExpires

    const shouldRedirectToPickChild =
      !parentSubscriptionWhitelistedRoutes[$route.name] && !child && isAppRoute

    if (!shouldRedirectToPickChild) {
      return false
    }

    const setChildren = async (storedData) => {
      try {
        // if array, then we get everyone, else we get just the child
        let result
        if (storedData && storedData.value && storedData.value.length === 1) {
          result = [
            await dispatch('children/getById', storedData.value[0], {
              root: true
            })
          ]
        } else {
          result = await dispatch('children/get', undefined, { root: true })
        }

        if (!result.length) {
          return
        }

        await dispatch(
          'setChild',
          {
            value: result,
            oldExp: storedData.expires
          },
          { root: true }
        )

        // update local value
        child = getters.getCurrentChild
        childExpires = getters.getCurrentChildExpires
      } catch (error) {
        return Promise.reject(error)
      }
    }

    let storedData

    /** SERVER SIDE */
    if (process.server) {
      let cookiesText = req.headers.cookie
      if (!cookiesText) {
        cookiesText = ''
      }

      const cookie = $cookies
        .getAll(cookiesText)
        .find(record => record.name === 'selectedChild')

      if (cookie) {
        storedData = JSON.parse(decodeURIComponent(cookie.value))

        await setChildren(storedData)
      }
    }

    const now = new Date().getTime()

    /** CLIENT SIDE */
    if (process.client && hasLocalStorage()) {
      let storedData = window.localStorage.getItem('selectedChild')

      if (storedData) {
        storedData = JSON.parse(storedData)

        if (now < storedData.expires) {
          await setChildren(storedData)
        }
      }
    }

    // if no child is selected in server or client
    if ((!child || !childExpires || now >= childExpires) && state.auth.userInfo.registerStep > 3) {
      $router.push({
        name: 'app-pick-child',
        query: {
          _time: now,
          redirect: encodeURIComponent($route.fullPath)
        }
      })
      return true
    }
  }
}
