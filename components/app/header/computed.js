import { mapGetters } from 'vuex'
import { UserFlow } from '@/models'
export default {
  computed: {
    ...mapGetters('auth', [
      'isUserInSignupProcess',
      'isUserLoggedIn',
      'getUserInfo',
      'hasUserLearnAndPlayPlan'
    ]),
    ...mapGetters({
      currentChildId: 'getCurrentChild'
    }),

    getVerifyEmail() {
      return true
    },

    items() {
      if (!this.isUserInSignupProcess && this.isUserLoggedIn) {
        let list = []
        if (!this.hasUserLearnAndPlayPlan) {
          list = [
            {
              title: 'Home',
              dataTestId: 'home',
              to: { name: 'app-virtual-preschool' },
              exact: true
            },
            {
              title: 'Daily Lessons',
              dataTestId: 'app-dashboard',
              to: { name: 'app-dashboard' },
              exact: false
            },
            {
              title: 'Well-being',
              dataTestId: 'app-learn-play',
              to: { name: 'app-learn-play' },
              exact: false
            },
            {
              title: 'Live Classes',
              dataTestId: 'app-live-classes',
              to: { name: 'app-live-classes' },
              exact: false
            },
            { title: 'Video Library', to: { name: 'app-library' }, exact: false, dataTestId: 'app-library' },
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
        } else {
          list = [
            {
              title: 'Home',
              dataTestId: 'home',
              to: { name: 'app-virtual-preschool' },
              exact: true
            },
            { title: 'Well-being', to: { name: 'app-learn-play' }, exact: false, dataTestId: 'app-learn-play' },
            { title: 'Watch and Learn', to: { name: 'app-library' }, exact: false, dataTestId: 'app-library' },
            {
              title: 'Live Classes',
              dataTestId: 'app-live-classes',
              to: { name: 'app-live-classes' },
              exact: false
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
          ]
        }
        return list
      }
      return []
    }
  }
}
