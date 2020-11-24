import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('auth', ['isUserInSignupProcess', 'isUserLoggedIn']),

    items () {
      if (!this.isUserInSignupProcess && this.isUserLoggedIn) {
        const list = [
          { title: 'Live Sessions', to: { name: 'app-live-sessions' }, exact: false },
          { title: 'Lessons', to: { name: 'app-dashboard' }, exact: false },
          { title: 'Activities', to: { name: 'app-activities' }, exact: false },
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

        // if (!['production'].includes(process.env.testEnv)) {
        //   list.unshift({ title: 'Live Sessions', to: { name: 'app-live-sessions' }, exact: false })
        // }

        if (!['production'].includes(process.env.testEnv)) {
          list.push({ title: 'Parent Corner', to: { name: 'app-live-sessions' }, exact: false })
        }

        return list
      }

      return []
    }
  }
}
