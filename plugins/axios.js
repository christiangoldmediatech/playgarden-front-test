export default function ({ $axios, redirect, store }) {
  $axios.setBaseURL(process.env.apiBaseUrl)

  $axios.onError((error) => {
    let body = 'Something went wrong.'

    if (error.response.status === 401) {
      body = 'Please login before use this section.'

      redirect({ name: 'index' })
    }

    store.commit('SET_NOTIFICATION_MESSAGE', { body, type: 'error' })
  })
}
