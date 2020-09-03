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

      return [
        { title: 'Home', to: { name: 'auth-login' } },
        { title: 'What we offer', to: { name: 'public-offer' } },
        { title: 'Our Curriculum', to: { name: 'public-curriculum' } },
        { title: 'Get to know us', to: { name: 'public-about-us' } }
      ]
    }
  }
}
