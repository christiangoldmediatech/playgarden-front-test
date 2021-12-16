import { hasLocalStorage } from '@/utils/window'
import parentSubscriptionWhitelistedRoutes from '~/utils/consts/parentSubscriptionWhitelistedRoutes.json'

export default async function({ redirect, route, store, req, app }) {
  const isAppRoute = /^app-.*$/.test(route.name)
  console.log('Cambio de child')

  let child = store.getters.getCurrentChild
  let childExpires = store.getters.getCurrentChildExpires

  const shouldRedirectToPickChild =
    !parentSubscriptionWhitelistedRoutes[route.name] && !child && isAppRoute

  if (!shouldRedirectToPickChild) {
    return
  }

  const setChildren = async (storedData) => {
    try {
      // if array, then we get everyone, else we get just the child
      let result
      if (storedData && storedData.value && storedData.value.length === 1) {
        result = [await store.dispatch('children/getById', storedData.value[0])]
      } else {
        result = await store.dispatch('children/get')
      }

      if (!result.length) {
        return
      }

      await store.dispatch('setChild', {
        value: result,
        oldExp: storedData.expires
      })

      // update local value
      child = store.getters.getCurrentChild
      childExpires = store.getters.getCurrentChildExpires
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

    const cookie = app.$cookies
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
  if (!child || !childExpires || now >= childExpires) {
    return redirect({
      name: 'app-pick-child',
      query: {
        _time: now,
        redirect: encodeURIComponent(route.fullPath)
      }
    })
  }
}
