import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('auth', ['isUserInSignupProcess', 'isUserLoggedIn']),

    items () {
      if (!this.isUserInSignupProcess && this.isUserLoggedIn) {
        const list = [
          {
            title: 'Daily Lessons',
            to: { name: 'app-dashboard' },
            exact: false
          },
          {
            title: 'Live Classes',
            to: { name: 'app-live-classes' },
            exact: false
          },
          { title: 'Library', to: { name: 'app-library' }, exact: false },
          { title: 'Music', to: { name: 'app-music' }, exact: false },
          { title: 'Playdates', to: { name: 'app-playdates' }, exact: false },
          {
            title: 'Student Cubby',
            to: { name: 'app-student-cubby' },
            exact: false
          }
          // {
          //   title: 'Parent Corner',
          //   to: { name: 'app-parent-corner' },
          //   exact: false
          // }
        ]

        if (!['production', 'staging'].includes(process.env.testEnv)) {
          list.push({
            title: 'Parent Corner',
            // to: { name: 'app-parent-corner' },
            to: { name: 'app-inactive-subscription' },
            exact: false
          })
        }

        return list
      }

      return []
    }
  }
}
