import { mapActions, mapGetters } from 'vuex'

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
    ...mapActions('children/lesson', { sendActivityProgress: 'saveActivityProgres' }),

    saveActivityProgress () {
      if (!this.currentVideo || this.currentVideo.ignoreVideoProgress || this.savingActivityProgress) { return }
      const mediaObject = this.currentVideo // From video player dialog mixin
      const date = new Date().toISOString().substr(0, 19)
      const time = this.player.currentTime()
      const duration = this.player.duration()
      const promises = []

      // Only save progress if the video hasn't been completed and we are ahead of where we last left off
      if (
        !mediaObject.viewed ||
        (!mediaObject.viewed.completed && mediaObject.viewed.time < time)
      ) {
        this.savingActivityProgress = true
        this.children.forEach((child) => {
          promises.push(
            this.sendActivityProgress({
              lessonId: this.lesson.id,
              childId: child.id,
              activity: {
                id: mediaObject.activityId,
                completed: duration - time < 3,
                time,
                date
              }
            })
          )
        })
        Promise.all(promises).then(() => {
          this.$nuxt.$emit('dashboard-panel-update')
          this.savingActivityProgress = false
        })
      }
    }
  }
}
