export default ({ app, store }) => {
  const auth = app.$fireAuthObj()
  auth.onAuthStateChanged((user) => {
    let socialUser = {}
    if (user) {
      socialUser = {
        uid: user.uid,
        providerData: user.providerData,
        email: user.email
      }
    }
    store.commit('auth/socialUser/SET_USER_INFO', socialUser)
  })
}
