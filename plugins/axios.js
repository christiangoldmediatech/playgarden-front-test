export default function ({ $axios, redirect, store }) {
  $axios.setBaseURL(process.env.apiBaseUrl)

  $axios.onError((error) => {
    // TODO: review this with Jesse
    // if (error.message !== 'CANCELLED_BY_USER') {
    //   return
    // }

    let body = 'Something went wrong.'

    if (error.response.status === 400) {
      body = Array.isArray(error.response.data.message)
        ? error.response.data.message.shift()
        : error.response.data.message
    }

    if (error.response.status === 401) {
      body = 'Please login before using this section.'

      redirect({ name: 'index' })
    }

    if (error.response.status === 409) {
      body = error.response.data.message
    }

    store.commit('SET_NOTIFICATION_MESSAGE', { body, type: 'error' })
  })
}
