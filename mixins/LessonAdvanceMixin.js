import { mapGetters, mapActions } from 'vuex'

export default {
  data: () => {
    return {
      loadingNext: false
    }
  },

  computed: {
    ...mapGetters('children/lesson', {
      nextLessonId: 'getNextLessonId',
      currentLessonId: 'getCurrentLessonId',
      previousLessonId: 'getPreviousLessonId'
    })
  },

  methods: {
    ...mapActions('children/lesson', ['getAdvanceLessonChildren']),

    previousLesson () {
      try {
        if (!this.loadingNext) {
          this.loadingNext = true

          this.$router.push(
            {
              name: 'app-dashboard',
              query: {
                childId: this.childId,
                lessonId: this.previousLessonId
              }
            },
            () => {
              this.$nuxt.$emit('dashboard-panel-update-redirect', () => {
                this.loadingNext = false
              })
            }
          )
        }
      } catch (e) {
        this.loadingNext = false
      }
    },

    async advance () {
      try {
        if (!this.loadingNext) {
          this.loadingNext = true

          if (this.currentLessonId === this.lesson.id) {
            await this.getAdvanceLessonChildren(this.childId)
            this.$router.push(
              {
                name: 'app-dashboard'
              },
              () => {
                this.$nuxt.$emit('dashboard-panel-update-redirect', () => {
                  this.loadingNext = false
                  this.$emit('next-finished')
                })
              }
            )
          } else {
            this.$router.push(
              {
                name: 'app-dashboard',
                query: {
                  childId: this.childId,
                  lessonId: this.nextLessonId
                }
              },
              () => {
                this.$nuxt.$emit('dashboard-panel-update-redirect', () => {
                  this.loadingNext = false
                  this.$emit('next-finished')
                })
              }
            )
          }
        }
      } catch (e) {
        if (e && e.errorCode === 100) {
          this.$router.push(
            {
              name: 'app-all-done'
            },
            () => {
              this.loadingNext = false
              this.$emit('next-finished')
            }
          )
        }
      }
    }
  }
}
