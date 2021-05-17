export default function ({ req, app, store }) {
  const cookie = app.$cookies.getAll(process.server ? req.headers.cookie : undefined)
    .find(record => record.name === 'GMT_UTM_PARAMS')

  if (cookie && cookie.value) {
    let utmCookie

    try {
      utmCookie = JSON.parse(cookie.value)
    } catch (err) {
      utmCookie = cookie.value
    }

    if (!!utmCookie && typeof utmCookie === 'object') {
      store.commit('auth/signup/SET_UTM', utmCookie)
    }
  }
}
