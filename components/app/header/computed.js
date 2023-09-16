import { mapGetters } from 'vuex'
import { UserFlow } from '@/models'
import dayjs from 'dayjs'
export default {
  computed: {
    ...mapGetters('auth', [
      'isUserInSignupProcess',
      'isUserLoggedIn',
      'getUserInfo',
      'hasPlayAndLearnPlan',
      'getAccessToken'
    ]),
    ...mapGetters({
      currentChildId: 'getCurrentChild'
    }),

    getVerifyEmail() {
      let days = 0
      if (this.getUserInfo.subscription) {
        const suscription = this.getUserInfo.subscription
        const datetime = dayjs.unix(suscription.current_period_end)
        days = dayjs(datetime).diff(new Date(), 'days')
      }

      if (this.getUserInfo.flow === UserFlow.NOCREDITCARD) {
        return this.getUserInfo.registerStep === 9
          ? days > 0
          : this.getUserInfo.registerStep === 6
      } else if (this.getUserInfo.flow === UserFlow.CREDITCARD) {
        return true
      }
    },

    items() {
      if (!this.isUserInSignupProcess && this.isUserLoggedIn) {
        let list = []
        if (!this.hasPlayAndLearnPlan) {
          list = [
            {
              title: this.$t('menus.header.home'),
              dataTestId: 'home',
              to: { name: 'app-virtual-preschool' },
              exact: true
            },
            {
              title: this.$t('menus.header.dailyLessons'),
              dataTestId: 'app-dashboard',
              to: { name: 'app-dashboard' },
              exact: false
            },
            {
              title: this.$t('menus.header.socialEmotional'),
              dataTestId: 'app-learn-play',
              to: { name: 'app-learn-play' },
              exact: false
            },
            {
              title: this.$t('menus.header.liveClasses'),
              dataTestId: 'app-live-classes',
              to: { name: 'app-live-classes' },
              exact: false
            },
            {
              title: this.$t('menus.header.videoLibrary'),
              to: { name: 'app-library' },
              exact: false,
              dataTestId: 'app-library'
            },
            {
              title: this.$t('menus.header.music'),
              to: { name: 'app-music' },
              exact: false,
              dataTestId: 'app-music'
            },
            {
              title: this.$t('menus.header.kidsCorner'),
              id: 'kids-corner-button',
              dataTestId: 'app-kids-corner',
              external: true,
              link: `${process.env.kidsCornerUrl}?atoken=${this.$store.getters['auth/getAccessToken']}`,
              openInNewTab: false
            },
            {
              title: this.$t('menus.header.cubby'),
              id: 'student-cubby-button',
              dataTestId: 'app-student-cubby',
              to: {
                name: 'app-student-cubby-puzzle',
                query: {
                  id: `${
                    this.currentChildId ? this.currentChildId[0].id : null
                  }`
                }
              },
              exact: false
            },
            {
              title: this.$t('menus.header.community'),
              dataTestId: 'app-community',
              external: true,
              link: `https://community.playgardenprep.com/login/?atoken=${this.getAccessToken}`,
              openInNewTab: true
            }
            // {
            //   title: 'Parent Corner',
            //   to: { name: 'app-parent-corner' },
            //   exact: false
            // }
          ]

          if (!['production'].includes(process.env.testEnv)) {
            list.push({
              title: this.$t('menus.header.parentCorner'),
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
            {
              title: 'Social & Emotional',
              to: { name: 'app-learn-play' },
              exact: false,
              dataTestId: 'app-learn-play'
            },
            {
              title: 'Video Library',
              to: { name: 'app-library' },
              exact: false,
              dataTestId: 'app-library'
            },
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
                  id: `${
                    this.currentChildId ? this.currentChildId[0].id : null
                  }`
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
