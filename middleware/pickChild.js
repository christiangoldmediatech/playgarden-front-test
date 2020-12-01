import { hasLocalStorage } from '@/utils/window'

export default async function ({ redirect, route, store }) {
  if (/^app-.*$/.test(route.name) && process.client) {
    console.log('on pickChild')
    const whiteList = {
      'auth-logout': 1,
      'auth-verify-email': 1,
      'app-pick-child': 1,
      'app-account': 1,
      'app-children-register': 1,
      'app-onboarding': 1,
      'app-payment-plan': 1,
      'app-payment-register': 1
    }

    if (!whiteList[route.name]) {
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
              if (
                Array.isArray(storedData.value) &&
                storedData.value.length &&
                storedData.value.length === 1
              ) {
                result = [
                  await store.dispatch('children/getById', storedData.value[0])
                ]
              } else {
                result = await store.dispatch('children/get')
              }

              if (result.length) {
                store.dispatch('setChild', {
                  value: result,
                  oldExp: storedData.expires
                })

                // Update local value
                child = store.getters.getCurrentChild
                childExpires = store.getters.getCurrentChildExpires
              }
            } catch (error) {
              return Promise.reject(error)
            }
          }
        }
      }

      // If no child is selected
      if (!child || !childExpires || currentMoment >= childExpires) {
        console.log('redirecting to pick-child')
        redirect(
          `/app/pick-child?_time=${currentMoment}&redirect=${encodeURIComponent(
            route.fullPath
          )}`
        )
      }
    }
  }
}
