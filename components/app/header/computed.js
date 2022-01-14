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
            to: { name: 'app-virtual-preschool' },
            exact: true
          },
          {
            title: 'Daily Lessons',
            to: { name: 'app-dashboard' },
            exact: false
          },
          {
            title: 'Kids Corner',
            external: true,
            link: `${process.env.kidsCornerUrl}?atoken=${this.$store.getters['auth/getAccessToken']}`,
            hidden: true
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
            to: { name: 'app-parent-corner' },
            exact: false
          })
        }

        return list
      }

      return []
    }
  }
}
