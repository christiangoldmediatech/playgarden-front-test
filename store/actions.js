import { hasLocalStorage } from '@/utils/window'
import parentSubscriptionWhitelistedRoutes from '~/utils/consts/parentSubscriptionWhitelistedRoutes.json'

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
  },

  async pickChild ({ dispatch, getters }, context) {
    const isAppRoute = /^app-.*$/.test(context.$route.name)
    let child = getters.getCurrentChild
    let childExpires = getters.getCurrentChildExpires

    const shouldRedirectToPickChild =
      !parentSubscriptionWhitelistedRoutes[context.$route.name] &&
      !child &&
      isAppRoute

    if (!shouldRedirectToPickChild) {
      return false
    }

    const setChildren = async (storedData) => {
      try {
        // if array, then we get everyone, else we get just the child
        let result
        if (storedData && storedData.value && storedData.value.length === 1) {
          result = [await dispatch('children/getById', storedData.value[0], { root: true })]
        } else {
          result = await dispatch('children/get', undefined, { root: true })
        }

        if (!result.length) {
          return
        }

        await dispatch('setChild', {
          value: result,
          oldExp: storedData.expires
        }, { root: true })

        // update local value
        child = getters.getCurrentChild
        childExpires = getters.getCurrentChildExpires
      } catch (error) {
        return Promise.reject(error)
      }
    }

    const now = new Date().getTime()

    /** CLIENT SIDE */
    let storedData = window.localStorage.getItem('selectedChild')

    if (storedData) {
      storedData = JSON.parse(storedData)

      if (now < storedData.expires) {
        await setChildren(storedData)
      }
    }

    // if no child is selected in server or client
    if (!child || !childExpires || now >= childExpires) {
      context.$router.push({
        name: 'app-pick-child',
        query: {
          _time: now,
          redirect: encodeURIComponent(
            context.$route.fullPath
          )
        }
      })

      return true
    }
  }
}
