import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('auth', ['isUserLoggedIn']),

    items () {
      if (this.isUserLoggedIn) {
        return [
          { title: 'Dashboard', to: { name: 'app-dashboard' } },
          { title: 'Library', to: { name: 'app-library' } },
          { title: 'Activities', to: { name: 'app-activities' } },
          { title: 'Profiles', to: { name: 'app-profile' } }
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
