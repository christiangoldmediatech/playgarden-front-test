import { hasLocalStorage } from '@/utils/window'

export default async function ({ redirect, route, store }) {
  const whiteList = [
    'app-pick-child',
    'app-account',
    'app-profile'
  ]

  let child = store.getters.getCurrentChild
  let childExpires = store.getters.getCurrentChildExpires
  const currentMoment = new Date().getTime()

  // Load child if stored and not expired
  if (!child && hasLocalStorage()) {
    let storedData = window.localStorage.getItem('selectedChild')
    if (storedData) {
      storedData = JSON.parse(storedData)

      if (currentMoment < storedData.expires) {
        try {
          let result
          // If array, then we get everyone, else we get just the child
          if (Array.isArray(storedData.value)) {
            result = await store.dispatch('children/get')
          } else {
            result = await store.dispatch('children/getById', storedData.value)
          }

          store.dispatch('setChild', { value: result, oldExp: storedData.expires })

          // Update local value
          child = store.getters.getCurrentChild
          childExpires = store.getters.getCurrentChildExpires
        } catch (error) {
          return Promise.reject(error)
        }
      }
    }
  }

  // If no child is selected
  if (
    (!child || !childExpires || currentMoment >= childExpires) &&
    (!whiteList.includes(route.name))
  ) {
    redirect(`/app/pick-child?redirect=${encodeURIComponent(route.fullPath)}`)
  }
}
