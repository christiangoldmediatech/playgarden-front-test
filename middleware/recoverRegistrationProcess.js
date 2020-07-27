export default function ({ redirect, route, store }) {
  if (process.client) {
    const user = store.getters['auth/getUserInfo']
    const registerStep = Number(user.registerStep)

    // REGISTER_PARENT=1 <- sign up
    // REGISTER_CHILDREN=2
    // PAYMENT=3
    // VERIFICATION=4 <- covered by "emailVerified" middleware
    // COMPLETED=5 <- no action

    if (
      user.id &&
      (registerStep === 2 || registerStep === 3) &&
      user.role.section === 'USERS' &&
      route.query.process !== 'signup' &&
      route.name !== 'auth-logout'
    ) {
      let name
      let step

      switch (registerStep) {
        case 2:
          name = 'app-children-register'
          step = 2
          break

        case 3:
          name = 'app-payment-register'
          step = 3
          break
      }

      redirect({
        name,
        query: {
          process: 'signup',
          step,
          _time: new Date().getTime() // <- just in order to avoid infinite loading bar
        }
      })
    }
  }
}
