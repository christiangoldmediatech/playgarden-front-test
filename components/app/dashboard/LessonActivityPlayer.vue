<template>
  <v-dialog
    v-model="dialog"
    eager
    dark
    fullscreen
    :persistent="true"
  >
    <div class="d-flex align-center justify-center bkg-black">
      <children-video-player
        ref="childrenVideoPlayer"
        :video-id="videoId"
        :width="dimensions.width"
        :height="dimensions.height"
        @hotkey="close"
        @ready="onReady"
      />
    </div>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import VideoPlayerDialog from '@/mixins/VideoPlayerDialog.js'

export default {
  name: 'LessonActivityPlayer',

  mixins: [VideoPlayerDialog],

  data: () => {
    return {
      eventMessage: 'open-lesson-activity-player',
      analyticsLoading: false
    }
  },

  computed: {
    overrides () {
      return {
        childId: this.$route.query.childId,
        lessonId: this.$route.query.lessonId
      }
    },

    buttons () {
      return [
        {
          text: 'COMPLETE WORKSHEETS',
          color: 'accent',
          iconLeft: 'mdi-square-edit-outline',
          action: () => {
            this.$router.push({ name: 'app-dashboard-online-worksheet', query: { ...this.overrides } })
          }
        },
        {
          text: 'SKIP TO ACTIVITIES',
          color: '#FEC572',
          iconLeft: 'mdi-play-outline',
          action: () => {
            // Find first activity
            const activities = this.getLesson.lessonsActivities
            if (activities.length) {
              this.$router.push({
                name: 'app-dashboard-lesson-activities',
                query: { ...this.overrides, id: activities[0].id }
              })
            }
          }
        }
      ]
    }
  },

  methods: {
    ...mapActions('children/lesson', ['saveActivityProgres']),
    ...mapActions('admin/activity/analytics', {
      createAnalytic: 'create',
      getAnalytics: 'getByChildId',
      updateAnalytic: 'update'
    }),

    doAnalytics () {
      if (this.analyticsLoading || !this.mediaObject.activityId) {
        return
      }

      this.analyticsLoading = true
      const promises = []
      const mediaObject = this.mediaObject
      const time = this.player.currentTime()
      const duration = this.player.duration()
      const didFinish = ((duration - time) < 3)

      this.children.forEach((child) => {
        const analyticOperation = new Promise((resolve, reject) => {
          this.getAnalytics({ activityId: mediaObject.activityId, childId: child.id })
            .then((result) => {
              if (typeof result === 'string' || Object.keys(result).length === 0) {
                return this.createAnalytic({
                  childrenId: child.id,
                  activityId: mediaObject.activityId,
                  didFinish,
                  time
                })
              } else if (result.didFinish) {
                return true
              }
              // In all other cases, update
              return this.updateAnalytic({
                analyticsId: result.id,
                params: {
                  didFinish,
                  time
                }
              })
            })
            .then((result) => {
              resolve(result)
            })
            .catch((err) => {
              reject(err)
            })
        })
        promises.push(analyticOperation)
      })

      Promise.all(promises).then(() => {
        this.analyticsLoading = false
      })
    },

    onReady (player) {
      this.player = player
      player.on('timeupdate', this.handleNextUp)
      player.on('pause', this.saveProgress)
      player.on('ended', this.completedVideo)
    },

    saveProgress () {
      this.doAnalytics()
      const mediaObject = this.mediaObject
      const date = new Date().toISOString().substr(0, 19)
      const time = this.player.currentTime()
      const duration = this.player.duration()
      const promises = []

      // Only save progress if the video hasn't been completed and we are ahead of where we last left off
      if (!mediaObject.viewed || (!mediaObject.viewed.completed && mediaObject.viewed.time < time)) {
        this.children.forEach((child) => {
          promises.push(
            this.saveActivityProgres({
              lessonId: this.getLesson.id,
              childId: child.id,
              activity: {
                id: mediaObject.activityId,
                completed: ((duration - time) < 3),
                time,
                date
              }
            })
          )
        })
        Promise.all(promises).then(() => {
          this.$nuxt.$emit('dashboard-panel-update')
        })
      }
    },

    completedVideo () {
      this.doAnalytics()
      if (!this.mediaObject.viewed || !this.mediaObject.viewed.completed) {
        const date = new Date().toISOString().substr(0, 19)
        const time = this.player.currentTime()
        const promises = []

        // Do promises
        this.children.forEach((child) => {
          promises.push(
            this.saveActivityProgres({
              lessonId: this.getLesson.id,
              childId: child.id,
              activity: {
                id: this.mediaObject.activityId,
                completed: true,
                time,
                date
              }
            })
          )
        })

        // Do promises
        Promise.all(promises).then(() => {
          this.$nuxt.$emit('dashboard-panel-update')
        })
      }

      // If not last item, then switch
      if (this.index < (this.playlist.length - 1)) {
        this.index++
        this.mediaObject = this.playlist[this.index]
        this.loadAndPlay()
        if (this.mediaObject.redirect) {
          this.$router.push({ name: 'app-dashboard-lesson-activities', query: { ...this.overrides, id: this.mediaObject.activityId } })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bkg-black {
  background-color: black;
  width: 100vw;
  height: 100vh;
}
</style>