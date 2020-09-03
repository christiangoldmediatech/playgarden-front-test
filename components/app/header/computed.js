import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('auth', ['isUserLoggedIn']),

    items () {
      if (this.isUserLoggedIn) {
        return [
          { title: 'Lessons', to: { name: 'app-dashboard' }, exact: false },
          { title: 'Student Cubby', to: { name: 'app-student-cubby' }, exact: false },
          { title: 'Activities', to: { name: 'app-activities' }, exact: false },
          { title: 'Parent Corner', to: { name: 'app-parent-corner' }, exact: false }
        ]
      }

      return []
    }
  }
}
