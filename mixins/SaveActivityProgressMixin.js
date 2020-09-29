import { mapActions, mapGetters } from 'vuex'
import { jsonCopy } from '@/utils/objectTools'

export default {
  data: () => {
    return {
      savingActivityProgress: false
    }
  },

  computed: {
    ...mapGetters('admin/curriculum', { lesson: 'getLesson' }),
    ...mapGetters({ children: 'getCurrentChild' })
  },

  methods: {
    ...mapActions('children/lesson', { sendActivityProgress: 'saveActivityProgress' }),

    saveActivityProgress () {
      const currentVideo = jsonCopy(this.currentVideo)
      if (!currentVideo || currentVideo.ignoreVideoProgress || this.savingActivityProgress) { return }
      const date = new Date().toISOString().substr(0, 19)
      const time = this.player.currentTime()
      const duration = this.player.duration()
      const promises = []

      // Only save progress if the video hasn't been completed and we are ahead of where we last left off
      if (
        !currentVideo.viewed ||
        (!currentVideo.viewed.completed && currentVideo.viewed.time < time)
      ) {
        this.savingActivityProgress = true
        this.children.forEach((child) => {
          promises.push(
            this.sendActivityProgress({
              lessonId: this.lesson.id,
              childId: child.id,
              activity: {
                id: currentVideo.activityId,
                completed: duration - time < 3,
                time,
                date
              }
            })
          )
        })
        Promise.all(promises).then(() => {
          this.$nuxt.$emit('dashboard-panel-update').then(() => {
            if (this.$route.name !== 'app-dashboard-lesson-completed' && this.lessonCompleted) {
              this.$router.push({
                name: 'app-dashboard-lesson-completed'
              })
            }
          })
          this.savingActivityProgress = false
        })
      }
    }
  }
}
