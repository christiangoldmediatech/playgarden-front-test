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
          { title: 'Parents Corner', to: { name: 'app-parents-corner' } }
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
