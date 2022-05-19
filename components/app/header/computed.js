import { mapGetters } from 'vuex'
import { UserFlow } from '@/models'
export default {
  computed: {
    ...mapGetters('auth', [
      'isUserInSignupProcess',
      'isUserLoggedIn',
      'getUserInfo'
    ]),
    ...mapGetters({
      currentChildId: 'getCurrentChild'
    }),

    getVerifyEmail() {
      return this.getUserInfo.flow === UserFlow.NOCREDITCARD
        ? this.getUserInfo.registerStep !== 5
        : true
    },

    items() {
      if (!this.isUserInSignupProcess && this.isUserLoggedIn) {
        const list = [
          {
            title: 'Home',
            dataTestId: 'home',
            to: { name: this.goToPage(this.getUserInfo) },
            exact: true
          },
          {
            title: 'Daily Lessons',
            dataTestId: 'app-dashboard',
            to: { name: 'app-dashboard' },
            exact: false
          },
          {
            title: 'Live Classes',
            dataTestId: 'app-live-classes',
            to: { name: 'app-live-classes' },
            exact: false
          },
          { title: 'Library', to: { name: 'app-library' }, exact: false, dataTestId: 'app-library' },
          { title: 'Music', to: { name: 'app-music' }, exact: false, dataTestId: 'app-music' },
          { title: 'Playdates', to: { name: 'app-playdates' }, exact: false, dataTestId: 'app-playdates' },
          {
            title: 'Kids Corner',
            dataTestId: 'app-kids-corner',
            external: true,
            link: `${process.env.kidsCornerUrl}?atoken=${this.$store.getters['auth/getAccessToken']}`
          },
          {
            title: 'Student Cubby',
            dataTestId: 'app-student-cubby',
            to: {
              name: 'app-student-cubby-puzzle',
              query: {
                id: `${this.currentChildId ? this.currentChildId[0].id : null}`
              }
            },
            exact: false
          }
          // {
          //   title: 'Parent Corner',
          //   to: { name: 'app-parent-corner' },
          //   exact: false
          // }
        ]

        if (!['production'].includes(process.env.testEnv)) {
          list.push({
            title: 'Parent Corner',
            dataTestId: 'app-parent-corner',
            to: { name: 'app-parent-corner' },
            exact: false
          })
        }

        return list
      }

      return []
    }
  },
  methods: {
    goToPage(user) {
      if (user.stripeStatus === 'active') {
        return 'app-virtual-preschool'
      } else {
        return 'app-dashboard'
      }
    }
  }
}
