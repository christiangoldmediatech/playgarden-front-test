import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('auth', ['isUserLoggedIn']),

    items () {
      if (this.isUserLoggedIn) {
        return [
          { title: 'Dashboard', to: { name: 'app-dashboard' } },
          { title: 'Student Cubby', to: { name: 'app-student-cubby' } },
          { title: 'Activities', to: { name: 'app-activities' } },
          { title: 'Parent Corner', to: { name: 'app-parent-corner' } }
        ]
      }

      return []
    }
  }
}
