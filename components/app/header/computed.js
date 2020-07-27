import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('auth', ['isUserLoggedIn']),

    items () {
      /*
      if (this.inAppendDrawer) {
        return [
          { title: 'Help', to: { name: 'app-dashboard' } },
          { title: 'Privacy Policy', to: { name: 'app-dashboard' } },
          { title: 'Terms & Conditions', to: { name: 'app-dashboard' } }
        ]
      }
      */

      if (this.isUserLoggedIn) {
        return [
          { title: 'Dashboard', to: { name: 'app-dashboard' } },
          { title: 'Library', to: { name: 'app-library' } },
          { title: 'Activities', to: { name: 'app-activities' } },
          { title: 'Profile', to: { name: 'app-profile' } }
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
