import { mapActions, mapGetters } from 'vuex'
import { jsonCopy } from '@/utils/objectTools'

export default {
  data: () => {
    return {
      savingProgress: false
    }
  },

  computed: {
    ...mapGetters('admin/curriculum', { lesson: 'getLesson' }),
    ...mapGetters({ children: 'getCurrentChild' })
  },

  methods: {
    ...mapActions('children/lesson', { sendVideoProgress: 'saveVideoProgress' }),

    saveVideoProgress () {
      // Save it before we have moved on
      const currentVideo = jsonCopy(this.currentVideo)
      if (!currentVideo || currentVideo.ignoreVideoProgress || this.savingProgress) { return }
      const date = new Date().toISOString().substr(0, 19)
      const time = this.player.currentTime()
      const duration = this.player.duration()
      const promises = []

      // Only save progress if the video hasn't been completed and we are ahead of where we last left off
      this.savingProgress = true
      this.children.forEach((child) => {
        promises.push(
          this.sendVideoProgress({
            lessonId: this.lesson.id,
            childId: child.id,
            video: {
              id: currentVideo.videoId,
              completed: duration - time <= 30,
              time,
              date
            }
          })
        )
      })
      Promise.all(promises).then(() => {
        if (promises.length) {
          this.$nuxt.$emit('dashboard-panel-update')
        }
        this.savingProgress = false
      })
    },

    completeVideoProgress () {
      // Save it before we have moved on
      const currentVideo = jsonCopy(this.currentVideo)
      if (!currentVideo || currentVideo.ignoreVideoProgress || this.savingProgress) { return }
      const date = new Date().toISOString().substr(0, 19)
      const time = this.player.currentTime()
      const promises = []

      // Only save progress if the video hasn't been completed and we are ahead of where we last left off
      if (
        !currentVideo.viewed ||
        (!currentVideo.viewed.completed && currentVideo.viewed.time < time)
      ) {
        this.savingProgress = true
        this.children.forEach((child) => {
          promises.push(
            this.sendVideoProgress({
              lessonId: this.lesson.id,
              childId: child.id,
              video: {
                id: currentVideo.videoId,
                completed: true,
                time,
                date
              }
            })
          )
        })
      }
      return Promise.all(promises)
    }
  }
}
