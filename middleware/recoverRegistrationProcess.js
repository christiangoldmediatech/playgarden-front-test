import { get } from 'lodash'

export default function ({ redirect, route, store }) {
  if (process.client) {
    console.log('on recoverRegistrationProcess')
    const ignoreRoute = {
      'auth-logout': 1,
      'jwt-recovery': 1,
      'privacy-policy': 1,
      'terms-conditions': 1,
      help: 1
    }

    const user = store.getters['auth/getUserInfo']
    const step = Number(user.registerStep)
    console.log('got user', user)
    console.log('on step', step)

    // EMAIL_ENTERED=0 -> Enter email page <- sign up
    // REGISTER_PARENT=1 -> Enter parent info page <- sign up
    // REGISTER_CHILDREN=2 -> Enter children information page
    // PLAN_SELECTION=3 -> Enter plan selection page
    // PAYMENT=4 -> Enter payment page
    // VERIFICATION=5 -> Enter email verifciation page <- covered by "emailVerified" middleware
    // COMPLETED=6 -> Completed <- no action

    if (
      user.id &&
      (step === 1 || step === 2 || step === 3 || step === 4) &&
      (!user.role || get(user, 'role.section') === 'USERS') &&
      route.query.process !== 'signup' &&
      !ignoreRoute[route.name]
    ) {
      let name

      switch (step) {
        case 1:
          name = 'auth-signup'
          break

        case 2:
          name = 'app-children-register'
          break

        case 3:
          name = 'app-payment-plan'
          break

        case 4:
          name = 'app-payment-register'
          break
      }

      console.log('redirecting to', name)

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
