import { setAxios } from '@/utils'

export default function({ $axios, redirect, store, app, route }) {
  $axios.setBaseURL(process.env.apiBaseUrl)

  let userIp = ''
  fetch('https://api.ipify.org')
    .then((response) => response.text())
    .then((data) => (userIp = data))

  $axios.onRequest((config) => {
    // Check and set token if we have one on the store
    config.headers.common['X-Forwarded-For'] = userIp
    if (store.state.auth.accessToken) {
      config.headers.Authorization = `Bearer ${store.state.auth.accessToken}`
      $axios.setToken(store.state.auth.accessToken, 'Bearer')
    }
  })

  $axios.onError((error) => {
    app.$sentry.captureException(error)
    if (
      store.getters.isDisabledAxiosGlobalErrorHandler ||
      error.message === 'UPLOAD_CANCELLED_BY_USER'
    ) {
      return
    }

    let body = 'Something went wrong.'

    if (error.response.status === 400) {
      body = Array.isArray(error.response.data.message)
        ? error.response.data.message.shift()
        : error.response.data.message
    }

    if (error.response.status === 401 && route.name !== 'auth-login') {
      store.dispatch('auth/logout', { redirect })
    }

    if (error.response.status === 409) {
      body = error.response.data.message
    }

    if (route.name !== 'auth-login') {
      store.commit('SET_NOTIFICATION_MESSAGE', { body, type: 'error' })
    }
  })

  setAxios($axios)
}
