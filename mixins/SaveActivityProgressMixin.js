import { mapActions, mapGetters } from 'vuex'
import { jsonCopy } from '@/utils/objectTools'

export default {
  data: () => {
    return {
      savingActivityProgress: false,
      pieceEarnedDialog: false,
      puzzleImg: null
    }
  },

  computed: {
    ...mapGetters('admin/curriculum', { lesson: 'getLesson' }),
    ...mapGetters({ children: 'getCurrentChild' })
  },

  methods: {
    ...mapActions('children/lesson', { sendActivityProgress: 'saveActivityProgress' }),

    async saveActivityProgress (completeOverride = false) {
      try {
        const currentVideo = jsonCopy(this.currentVideo)
        if (
          this.lesson.previewMode ||
          !currentVideo ||
          currentVideo.ignoreVideoProgress ||
          this.savingActivityProgress
        ) {
          return
        }
        const date = new Date().toISOString().substr(0, 19)
        const time = this.player.currentTime()
        const duration = this.player.duration()
        const promises = []

        this.savingActivityProgress = true
        this.children.forEach((child) => {
          promises.push(
            this.sendActivityProgress({
              lessonId: this.lesson.id,
              childId: child.id,
              activity: {
                id: currentVideo.activityId,
                completed: completeOverride || duration - time <= 30,
                time,
                date
              }
            }).then((result) => {
              if (result.puzzle) {
                this.player.pause()
                this.pieceEarnedDialog = true
                this.puzzleImg = result.puzzleImg
              }
            })
          )
        })

        await Promise.allSettled(promises)
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.$nuxt.$emit('dashboard-panel-update')
        this.savingActivityProgress = false
      }
    }
  }
}
